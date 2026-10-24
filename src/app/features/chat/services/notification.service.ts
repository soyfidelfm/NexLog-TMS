import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/language.service';
import { AppNotification, NotificationType } from '../../../core/models/chat.model';
import { ToastService } from '../../../shared/toast/toast.service';
import { ChatBackend } from './chat-backend.service';
import { DesktopNotifyService } from './desktop-notify.service';
import { RealtimeService } from './realtime.service';

const MAX_ITEMS = 100;

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  message: '💬',
  order: '📦',
  shipment: '🚚',
  system: '⚙️',
};

export interface IngestOptions {
  /** Show a toast (default true for non-message types; chat messages get their own richer toast from ChatService). */
  toast?: boolean;
}

/** Bell / notifications page store: list, unread count, read state, realtime ingestion and toasts. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly backend = inject(ChatBackend);
  private readonly realtime = inject(RealtimeService);
  private readonly toast = inject(ToastService);
  private readonly desktop = inject(DesktopNotifyService);
  private readonly translate = inject(TranslateService);
  private readonly lang = inject(LanguageService);
  private readonly router = inject(Router);

  private readonly _items = signal<AppNotification[]>([]);
  /** Newest first. */
  readonly items = this._items.asReadonly();
  readonly unreadCount = computed(() => this._items().filter(n => !n.read).length);
  readonly recent = computed(() => this._items().slice(0, 8));
  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly error = signal(false);

  /** Message ids already seen in a focused thread: a late server notification for them is dropped. */
  private readonly suppressed = new Set<string>();
  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;
    this.realtime.events$.subscribe(e => {
      if (e.type === 'notification') this.ingest(e.notification);
      else if (e.type === 'resync') this.load();
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.backend.call(api => api.listNotifications(50)).subscribe({
      next: list => {
        this._items.set(this.sort(list.map(n => (n.refId && this.suppressed.has(n.refId) ? { ...n, read: true } : n))));
        this.loading.set(false);
        this.loaded.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  /** Adds a notification (deduped by id and by `refId`). Returns false when it was ignored. */
  ingest(n: AppNotification, opts: IngestOptions = {}): boolean {
    if (n.refId && this.suppressed.has(n.refId)) return false;
    const exists = this._items().some(x => x.id === n.id || (!!n.refId && x.refId === n.refId));
    if (exists) return false;
    this._items.update(list => this.sort([n, ...list]).slice(0, MAX_ITEMS));
    const toast = opts.toast ?? n.type !== 'message';
    if (toast && !n.read) {
      const title = this.title(n);
      const body = this.body(n);
      this.toast.show({
        title,
        message: body,
        icon: NOTIFICATION_ICONS[n.type],
        kind: 'info',
        onClick: n.link ? () => this.openLink(n) : undefined,
        actionLabel: n.link ? this.translate.instant('notifications.open') : undefined,
      });
      this.desktop.notify(title, body, n.id, n.link ? () => this.openLink(n) : undefined);
    }
    return true;
  }

  markRead(id: string): void {
    const n = this._items().find(x => x.id === id);
    if (!n || n.read) return;
    this.patch(x => x.id === id);
    this.backend.call(api => api.markNotificationRead(id)).subscribe({ error: () => undefined });
  }

  markAllRead(): void {
    if (!this.unreadCount()) return;
    this.patch(() => true);
    this.backend.call(api => api.markAllNotificationsRead()).subscribe({ error: () => undefined });
  }

  /** Local only: the server marks them when the conversation itself is marked read. */
  markConversationRead(conversationId: string): void {
    this.patch(x => x.type === 'message' && x.conversationId === conversationId);
  }

  /** The message was read in an open thread: mark any notification for it and drop future ones. */
  suppress(refId: string): void {
    this.suppressed.add(refId);
    this.patch(x => x.refId === refId);
  }

  reset(): void {
    this._items.set([]);
    this.loaded.set(false);
    this.suppressed.clear();
  }

  title(n: AppNotification): string {
    this.lang.lang();
    return n.titleKey ? this.translate.instant(n.titleKey, n.params ?? undefined) : n.title;
  }

  body(n: AppNotification): string {
    this.lang.lang();
    if (n.bodyKey) return this.translate.instant(n.bodyKey, n.params ?? undefined);
    return n.body ?? '';
  }

  openLink(n: AppNotification): void {
    this.markRead(n.id);
    if (n.link) void this.router.navigateByUrl(n.link);
  }

  private patch(pred: (n: AppNotification) => boolean): void {
    this._items.update(list => list.map(n => (!n.read && pred(n) ? { ...n, read: true } : n)));
  }

  private sort(list: AppNotification[]): AppNotification[] {
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
