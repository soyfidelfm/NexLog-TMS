import { DOCUMENT, Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth.service';
import { AppNotification, ChatUser, Conversation, Message } from '../../../core/models/chat.model';
import { ToastService } from '../../../shared/toast/toast.service';
import { ChatBackend } from './chat-backend.service';
import { DesktopNotifyService } from './desktop-notify.service';
import { NotificationService } from './notification.service';
import { RealtimeService } from './realtime.service';

export const PAGE_SIZE = 30;
export const TYPING_TTL_MS = 4000;
export const TYPING_THROTTLE_MS = 2500;
export const MAX_MESSAGE_LENGTH = 2000;

export interface TypingInfo { userId: string; name: string }

let localSeq = 0;
function newClientId(): string {
  const c = globalThis.crypto as Crypto | undefined;
  return c?.randomUUID ? c.randomUUID() : `c-${Date.now().toString(36)}-${(++localSeq).toString(36)}`;
}

/**
 * Chat store (signals). Owns conversations, message history per conversation, the messenger panel state,
 * typing indicators and optimistic sends. Data comes from `ChatBackend` (real API or mock) and realtime
 * events from `RealtimeService` (SignalR hub or the mock's simulated events).
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly auth = inject(AuthService);
  private readonly backend = inject(ChatBackend);
  private readonly realtime = inject(RealtimeService);
  private readonly notifications = inject(NotificationService);
  private readonly toast = inject(ToastService);
  private readonly desktop = inject(DesktopNotifyService);
  private readonly translate = inject(TranslateService);
  private readonly doc = inject(DOCUMENT);

  readonly mode = this.backend.mode;
  readonly realtimeState = this.realtime.state;

  readonly me = computed<ChatUser>(() => {
    const u = this.auth.user();
    return {
      id: this.backend.mockUserId() ?? u?.sub ?? '',
      name: u?.name ?? u?.email ?? '',
      email: u?.email ?? '',
      avatarUrl: u?.picture ?? null,
    };
  });

  private readonly _conversations = signal<Conversation[]>([]);
  /** Most recent activity first. */
  readonly conversations = computed(() =>
    [...this._conversations()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  readonly loadingConversations = signal(false);
  readonly conversationsError = signal(false);
  readonly conversationsLoaded = signal(false);

  private readonly _messages = signal<Record<string, Message[]>>({});
  private readonly _hasMore = signal<Record<string, boolean>>({});
  readonly loadingThread = signal<string | null>(null);
  readonly loadingOlder = signal<string | null>(null);
  readonly threadError = signal<string | null>(null);
  private readonly _typing = signal<Record<string, TypingInfo>>({});
  readonly typing = this._typing.asReadonly();

  /** Messenger panel (dock on desktop, full screen on mobile). One active thread at a time. */
  readonly panelOpen = signal(false);
  readonly activeId = signal<string | null>(null);
  /** "New chat" (user search) view inside the panel. */
  readonly composing = signal(false);
  /** Tab visible + window focused. */
  readonly windowFocused = signal(true);

  readonly totalUnread = computed(() => this._conversations().reduce((n, c) => n + (c.unreadCount || 0), 0));
  readonly activeConversation = computed(() => this._conversations().find(c => c.id === this.activeId()) ?? null);
  readonly activeMessages = computed(() => {
    const id = this.activeId();
    return id ? this._messages()[id] ?? [] : [];
  });
  readonly activeHasMore = computed(() => {
    const id = this.activeId();
    return !!id && !!this._hasMore()[id];
  });

  private started = false;
  private typingTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private lastTypingSent = new Map<string, number>();
  private drafts = new Map<string, string>();

  constructor() {
    // Hub lifecycle: connected only while signed in and in live mode; state cleared on logout.
    let wasAuthed = false;
    effect(() => {
      const authed = this.auth.isAuthenticated();
      const live = this.backend.mode() === 'live';
      untracked(() => {
        this.realtime.setActive(this.started && authed && live);
        if (wasAuthed && !authed) this.reset();
        wasAuthed = authed;
      });
    });

    const win = this.doc.defaultView;
    if (win) {
      const update = () => {
        const focused = this.doc.visibilityState === 'visible' && (typeof this.doc.hasFocus !== 'function' || this.doc.hasFocus());
        this.windowFocused.set(focused);
        const id = this.activeId();
        if (focused && this.panelOpen() && id) this.markRead(id);
      };
      win.addEventListener('focus', update);
      win.addEventListener('blur', update);
      this.doc.addEventListener('visibilitychange', update);
    }
  }

  /** Idempotent; called by MainLayout once the user is in the app. */
  start(): void {
    if (this.started) return;
    this.started = true;
    this.realtime.setActive(this.auth.isAuthenticated() && this.backend.mode() === 'live');
    this.realtime.events$.subscribe(e => {
      switch (e.type) {
        case 'message': this.onMessage(e.message); break;
        case 'typing': this.onTyping(e.conversationId, e.userId, e.userName ?? null); break;
        case 'resync': this.loadConversations(); break;
        default: break;
      }
    });
    this.notifications.start();
    this.loadConversations();
  }

  // ---- panel --------------------------------------------------------------------------------------------------

  openPanel(): void { this.panelOpen.set(true); }
  closePanel(): void { this.panelOpen.set(false); this.composing.set(false); }
  togglePanel(): void { if (this.panelOpen()) this.closePanel(); else this.openPanel(); }
  /** Back to the conversation list. */
  closeThread(): void { this.activeId.set(null); this.composing.set(false); }
  startComposing(): void { this.panelOpen.set(true); this.composing.set(true); }

  isFocused(conversationId: string): boolean {
    return this.panelOpen() && !this.composing() && this.activeId() === conversationId && this.windowFocused();
  }

  peerOf(conv: Conversation | null | undefined): ChatUser | null {
    if (!conv) return null;
    const me = this.me().id;
    return conv.participants.find(p => p.id !== me) ?? conv.participants[0] ?? null;
  }

  /** Name of a participant (for group-safe rendering of incoming messages). */
  nameOf(conv: Conversation | null | undefined, userId: string): string {
    return conv?.participants.find(p => p.id === userId)?.name ?? '';
  }

  // ---- loading ------------------------------------------------------------------------------------------------

  loadConversations(after?: () => void): void {
    this.loadingConversations.set(true);
    this.conversationsError.set(false);
    this.backend.call(api => api.listConversations()).subscribe({
      next: list => {
        this._conversations.set(list);
        this.loadingConversations.set(false);
        this.conversationsLoaded.set(true);
        after?.();
      },
      error: () => {
        this.loadingConversations.set(false);
        this.conversationsError.set(true);
      },
    });
  }

  openConversation(id: string): void {
    this.panelOpen.set(true);
    this.composing.set(false);
    this.activeId.set(id);
    if (!this._conversations().some(c => c.id === id)) this.loadConversations();
    if (this._messages()[id]) this.markRead(id);
    else this.loadThread(id);
  }

  /** Opens (or creates) the 1:1 conversation with a user from the search. */
  startWith(user: ChatUser): void {
    const existing = this._conversations().find(c => c.participants.some(p => p.id === user.id));
    if (existing) {
      this.openConversation(existing.id);
      return;
    }
    this.backend.call(api => api.openConversation(user.id)).subscribe({
      next: conv => {
        this.upsertConversation(conv);
        this.openConversation(conv.id);
      },
      error: () => this.toast.error(this.translate.instant('chat.errors.openFailed')),
    });
  }

  loadThread(id: string): void {
    this.loadingThread.set(id);
    this.threadError.set(null);
    this.backend.call(api => api.listMessages(id, null, PAGE_SIZE)).subscribe({
      next: page => {
        // Keep optimistic / realtime messages that arrived while the first page was loading.
        const pending = (this._messages()[id] ?? []).filter(m => !page.items.some(x => this.same(x, m)));
        this._messages.update(all => ({ ...all, [id]: [...page.items, ...pending] }));
        this._hasMore.update(h => ({ ...h, [id]: page.hasMore }));
        this.loadingThread.set(null);
        if (this.isFocused(id)) this.markRead(id);
      },
      error: () => {
        this.loadingThread.set(null);
        this.threadError.set(id);
      },
    });
  }

  /** Older history (paging upward). */
  loadOlder(id: string): void {
    if (this.loadingOlder() === id || !this._hasMore()[id]) return;
    const first = (this._messages()[id] ?? []).find(m => !m.status || m.status === 'sent');
    if (!first) return;
    this.loadingOlder.set(id);
    this.backend.call(api => api.listMessages(id, first.id, PAGE_SIZE)).subscribe({
      next: page => {
        this._messages.update(all => {
          const cur = all[id] ?? [];
          const older = page.items.filter(m => !cur.some(x => x.id === m.id));
          return { ...all, [id]: [...older, ...cur] };
        });
        this._hasMore.update(h => ({ ...h, [id]: page.hasMore }));
        this.loadingOlder.set(null);
      },
      error: () => this.loadingOlder.set(null),
    });
  }

  markRead(id: string): void {
    const conv = this._conversations().find(c => c.id === id);
    this.notifications.markConversationRead(id);
    if (!conv || !conv.unreadCount) return;
    this.patchConversation(id, { unreadCount: 0 });
    this.backend.call(api => api.markConversationRead(id)).subscribe({ error: () => undefined });
  }

  /** Click on a bell / page entry: chat notifications open the thread, the rest navigate to their link. */
  openNotification(n: AppNotification): void {
    if (n.conversationId) {
      this.notifications.markRead(n.id);
      this.openConversation(n.conversationId);
    } else {
      this.notifications.openLink(n);
    }
  }

  // ---- sending ------------------------------------------------------------------------------------------------

  /** Optimistic send: the bubble appears immediately as `sending`, then `sent` (server copy) or `failed`. */
  send(conversationId: string, text: string): void {
    const body = text.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!body) return;
    const clientId = newClientId();
    const msg: Message = {
      id: `tmp-${clientId}`, clientId, conversationId, senderId: this.me().id, body,
      createdAt: new Date().toISOString(), status: 'sending',
    };
    this.appendMessage(msg);
    this.touchConversation(msg);
    this.dispatch(msg);
  }

  retry(conversationId: string, clientId: string): void {
    const msg = (this._messages()[conversationId] ?? []).find(m => m.clientId === clientId && m.status === 'failed');
    if (!msg) return;
    this.patchMessage(conversationId, clientId, { status: 'sending' });
    this.dispatch({ ...msg, status: 'sending' });
  }

  /** Removes a failed message. */
  discard(conversationId: string, clientId: string): void {
    this._messages.update(all => ({ ...all, [conversationId]: (all[conversationId] ?? []).filter(m => m.clientId !== clientId || m.status !== 'failed') }));
  }

  /** Unsent text per conversation, kept while switching threads. */
  draftFor(conversationId: string): string {
    return this.drafts.get(conversationId) ?? '';
  }

  setDraft(conversationId: string, text: string): void {
    if (text) this.drafts.set(conversationId, text);
    else this.drafts.delete(conversationId);
  }

  notifyTyping(conversationId: string): void {
    const now = Date.now();
    if (now - (this.lastTypingSent.get(conversationId) ?? 0) < TYPING_THROTTLE_MS) return;
    this.lastTypingSent.set(conversationId, now);
    this.realtime.sendTyping(conversationId);
  }

  private dispatch(msg: Message): void {
    const clientId = msg.clientId!;
    this.backend.call(api => api.sendMessage(msg.conversationId, { body: msg.body, clientId })).subscribe({
      next: saved => this.reconcile({ ...saved, clientId: saved.clientId ?? clientId }),
      error: () => this.patchMessage(msg.conversationId, clientId, { status: 'failed' }),
    });
  }

  // ---- realtime -----------------------------------------------------------------------------------------------

  private onMessage(m: Message): void {
    const known = this._conversations().some(c => c.id === m.conversationId);
    if (!known) {
      // First message of a conversation someone else started: fetch it (its unread count comes from the server).
      this.loadConversations(() => this.applyIncoming(m, true));
      return;
    }
    this.applyIncoming(m, false);
  }

  private applyIncoming(m: Message, countFromServer: boolean): void {
    const mine = m.senderId === this.me().id;
    if (this.reconcile(m)) return; // echo of a message we already have
    if (this._messages()[m.conversationId]) this.appendMessage(m);
    this.clearTyping(m.conversationId);
    const conv = this._conversations().find(c => c.id === m.conversationId);
    if (!conv) return;
    const focused = this.isFocused(m.conversationId);
    this.patchConversation(m.conversationId, {
      lastMessage: m,
      updatedAt: m.createdAt > conv.updatedAt ? m.createdAt : conv.updatedAt,
      unreadCount: focused ? 0 : !mine && !countFromServer ? conv.unreadCount + 1 : conv.unreadCount,
    });
    if (mine) return;
    if (focused) {
      this.notifications.suppress(m.id);
      this.backend.call(api => api.markConversationRead(m.conversationId)).subscribe({ error: () => undefined });
      return;
    }
    this.alert(conv, m);
  }

  /** Bell entry + toast (+ OS notification when the tab is hidden) for a message the user hasn't seen. */
  private alert(conv: Conversation, m: Message): void {
    const sender = conv.participants.find(p => p.id === m.senderId) ?? this.peerOf(conv);
    const name = sender?.name ?? '';
    const n: AppNotification = {
      id: `msg-${m.id}`, type: 'message', title: name, body: m.body, titleKey: 'notifications.messageFrom',
      params: { name }, createdAt: m.createdAt, read: false, conversationId: m.conversationId, refId: m.id,
    };
    if (!this.notifications.ingest(n, { toast: false })) return;
    const open = () => this.openConversation(conv.id);
    const title = this.translate.instant('chat.toast.newMessage', { name });
    this.toast.show({
      kind: 'message', title, message: m.body, avatar: { name, url: sender?.avatarUrl },
      onClick: open, actionLabel: this.translate.instant('chat.toast.open', { name }),
    });
    this.desktop.notify(title, m.body, `chat-${conv.id}`, open);
  }

  private onTyping(conversationId: string, userId: string, userName: string | null): void {
    if (userId === this.me().id) return;
    const conv = this._conversations().find(c => c.id === conversationId);
    const name = userName ?? this.nameOf(conv, userId);
    this._typing.update(t => ({ ...t, [conversationId]: { userId, name } }));
    clearTimeout(this.typingTimers.get(conversationId));
    this.typingTimers.set(conversationId, setTimeout(() => this.clearTyping(conversationId), TYPING_TTL_MS));
  }

  private clearTyping(conversationId: string): void {
    clearTimeout(this.typingTimers.get(conversationId));
    this.typingTimers.delete(conversationId);
    if (!this._typing()[conversationId]) return;
    this._typing.update(t => {
      const { [conversationId]: _, ...rest } = t;
      return rest;
    });
  }

  // ---- state helpers ------------------------------------------------------------------------------------------

  private same(a: Message, b: Message): boolean {
    return a.id === b.id || (!!a.clientId && a.clientId === b.clientId);
  }

  /** Replaces an optimistic/known message with the server copy. Returns true if it was already in the thread. */
  private reconcile(saved: Message): boolean {
    const list = this._messages()[saved.conversationId];
    if (!list) return false;
    const idx = list.findIndex(m => this.same(m, saved));
    if (idx < 0) return false;
    const next = [...list];
    next[idx] = { ...saved, status: 'sent' };
    // The realtime echo and the POST response can both arrive: never keep two copies.
    const deduped = next.filter((m, i) => i === idx || !this.same(m, saved));
    this._messages.update(all => ({ ...all, [saved.conversationId]: deduped }));
    const conv = this._conversations().find(c => c.id === saved.conversationId);
    if (conv?.lastMessage && this.same(conv.lastMessage, saved)) this.patchConversation(conv.id, { lastMessage: next[idx] });
    return true;
  }

  private appendMessage(m: Message): void {
    this._messages.update(all => ({ ...all, [m.conversationId]: [...(all[m.conversationId] ?? []), m] }));
  }

  private patchMessage(conversationId: string, clientId: string, patch: Partial<Message>): void {
    this._messages.update(all => ({
      ...all,
      [conversationId]: (all[conversationId] ?? []).map(m => (m.clientId === clientId ? { ...m, ...patch } : m)),
    }));
    const conv = this._conversations().find(c => c.id === conversationId);
    if (conv?.lastMessage?.clientId === clientId) this.patchConversation(conversationId, { lastMessage: { ...conv.lastMessage, ...patch } });
  }

  private touchConversation(m: Message): void {
    this.patchConversation(m.conversationId, { lastMessage: m, updatedAt: m.createdAt });
  }

  private patchConversation(id: string, patch: Partial<Conversation>): void {
    this._conversations.update(list => list.map(c => (c.id === id ? { ...c, ...patch } : c)));
  }

  private upsertConversation(conv: Conversation): void {
    this._conversations.update(list => (list.some(c => c.id === conv.id) ? list.map(c => (c.id === conv.id ? conv : c)) : [conv, ...list]));
  }

  private reset(): void {
    this.realtime.setActive(false);
    this._conversations.set([]);
    this._messages.set({});
    this._hasMore.set({});
    this._typing.set({});
    this.activeId.set(null);
    this.panelOpen.set(false);
    this.composing.set(false);
    this.conversationsLoaded.set(false);
    this.drafts.clear();
    this.notifications.reset();
    this.toast.clear();
  }
}
