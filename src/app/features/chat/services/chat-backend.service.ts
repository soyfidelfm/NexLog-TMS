import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, defer, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ChatApi } from './chat-api';
import { HttpChatApi } from './http-chat-api';
import { MOCK_ME_ID, MockChatApi } from './mock-chat-api';

export type ChatMode = 'live' | 'mock';

/** Statuses that mean "the chat backend is not there (yet)", as opposed to a real error. */
const UNAVAILABLE = new Set([0, 404, 501, 502, 503, 504]);

/**
 * Chooses the chat data layer. Switching to the real API is one line: `environment.useMockChat = false`.
 * In live mode, if the endpoints are unreachable / 404 and `environment.chatMockFallback` is on,
 * it falls back to the mock layer once (the UI shows a "Demo data" badge).
 */
@Injectable({ providedIn: 'root' })
export class ChatBackend {
  private readonly http = inject(HttpChatApi);
  private readonly mock = inject(MockChatApi);

  private readonly _mode = signal<ChatMode>(environment.useMockChat ? 'mock' : 'live');
  readonly mode = this._mode.asReadonly();
  readonly api = computed<ChatApi>(() => (this._mode() === 'mock' ? this.mock : this.http));
  /** True when live mode was requested but we had to fall back to example data. */
  readonly fellBack = signal(false);

  /** Id of the current user as the active data layer knows it (`null` = use the Auth0 sub). */
  mockUserId(): string | null {
    return this._mode() === 'mock' ? MOCK_ME_ID : null;
  }

  /** Runs `fn` against the active layer; on "backend unavailable" falls back to mock (if allowed) and retries once. */
  call<T>(fn: (api: ChatApi) => Observable<T>): Observable<T> {
    return defer(() => fn(this.api())).pipe(
      catchError((err: unknown) => (this.fallBack(err) ? defer(() => fn(this.api())) : throwError(() => err))),
    );
  }

  /** Test / dev hook. */
  setMode(mode: ChatMode): void {
    this._mode.set(mode);
  }

  private fallBack(err: unknown): boolean {
    if (this._mode() !== 'live' || !environment.chatMockFallback) return false;
    const status = err instanceof HttpErrorResponse ? err.status : undefined;
    if (status === undefined || !UNAVAILABLE.has(status)) return false;
    console.warn('[NexLog chat] backend unavailable (HTTP %s); using example data.', status);
    this._mode.set('mock');
    this.fellBack.set(true);
    return true;
  }
}
