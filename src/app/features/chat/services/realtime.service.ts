import { Injectable, Injector, inject, signal } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import type { HubConnection } from '@microsoft/signalr';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppNotification, Message, RealtimeEvent } from '../../../core/models/chat.model';

export type RealtimeState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

/** Hub -> client method names (see features/chat/README.md). */
export const HUB_EVENTS = {
  message: 'MessageReceived',
  typing: 'TypingStarted',
  read: 'MessagesRead',
  notification: 'NotificationReceived',
} as const;
/** Client -> hub method. */
export const HUB_SEND_TYPING = 'Typing';

const RETRY_MAX_MS = 60_000;

/**
 * Realtime transport. Components never talk to SignalR; they consume `events$`.
 * - Live mode: `setActive(true)` opens the hub (lazy-loaded @microsoft/signalr, Auth0 access token via
 *   accessTokenFactory, automatic reconnect, manual backoff retry if the first start fails).
 *   `setActive(false)` (logout / switching to mock) stops it.
 * - Mock mode: the hub is never opened; `MockChatApi` pushes simulated events with `emit()`.
 */
@Injectable({ providedIn: 'root' })
export class RealtimeService {
  /** Auth0Service is looked up on first connect (not at construction), like apiErrorInterceptor, to avoid DI cycles. */
  private readonly injector = inject(Injector);
  private readonly subject = new Subject<RealtimeEvent>();
  readonly events$: Observable<RealtimeEvent> = this.subject.asObservable();

  private readonly _state = signal<RealtimeState>('idle');
  readonly state = this._state.asReadonly();

  private conn?: HubConnection;
  private active = false;
  private attempt = 0;
  private retryHandle?: ReturnType<typeof setTimeout>;
  /** Bumped on every connect/disconnect so a slow start() can detect it is stale. */
  private epoch = 0;

  emit(event: RealtimeEvent): void {
    this.subject.next(event);
  }

  setActive(active: boolean): void {
    if (active === this.active) return;
    this.active = active;
    if (active) void this.connect();
    else void this.disconnect();
  }

  /** Tells the hub the current user is typing in a conversation (no-op while offline / mock). */
  sendTyping(conversationId: string): void {
    if (this.conn && this._state() === 'connected') {
      this.conn.send(HUB_SEND_TYPING, conversationId).catch(() => undefined);
    }
  }

  private async connect(): Promise<void> {
    const epoch = ++this.epoch;
    this._state.set('connecting');
    try {
      const signalR = await import('@microsoft/signalr');
      if (epoch !== this.epoch) return;
      const auth0 = this.injector.get(Auth0Service);
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(environment.hubUrl, {
          accessTokenFactory: async () =>
            (await firstValueFrom(auth0.getAccessTokenSilently({ authorizationParams: { audience: environment.auth0.audience } }))) ?? '',
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      conn.on(HUB_EVENTS.message, (message: Message) => this.emit({ type: 'message', message }));
      conn.on(HUB_EVENTS.typing, (p: { conversationId: string; userId: string; userName?: string }) =>
        this.emit({ type: 'typing', conversationId: p.conversationId, userId: p.userId, userName: p.userName }));
      conn.on(HUB_EVENTS.read, (p: { conversationId: string; userId: string }) =>
        this.emit({ type: 'read', conversationId: p.conversationId, userId: p.userId }));
      conn.on(HUB_EVENTS.notification, (notification: AppNotification) => this.emit({ type: 'notification', notification }));

      conn.onreconnecting(() => this._state.set('reconnecting'));
      conn.onreconnected(() => {
        this._state.set('connected');
        this.emit({ type: 'resync' });
      });
      conn.onclose(() => {
        if (epoch !== this.epoch || !this.active) return;
        this._state.set('disconnected');
        this.scheduleRetry();
      });

      await conn.start();
      if (epoch !== this.epoch) {
        void conn.stop();
        return;
      }
      this.conn = conn;
      this.attempt = 0;
      this._state.set('connected');
      // Anything that happened before the socket was up (or during a retry loop) is fetched again.
      this.emit({ type: 'resync' });
    } catch {
      if (epoch !== this.epoch || !this.active) return;
      this._state.set('disconnected');
      this.scheduleRetry();
    }
  }

  private scheduleRetry(): void {
    clearTimeout(this.retryHandle);
    const delay = Math.min(RETRY_MAX_MS, 1000 * 2 ** this.attempt++);
    this.retryHandle = setTimeout(() => {
      if (this.active) void this.connect();
    }, delay);
  }

  private async disconnect(): Promise<void> {
    this.epoch++;
    clearTimeout(this.retryHandle);
    this.attempt = 0;
    const conn = this.conn;
    this.conn = undefined;
    this._state.set('idle');
    try { await conn?.stop(); } catch { /* already closed */ }
  }
}
