import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, defer, map, of, switchMap, throwError, timer } from 'rxjs';
import { AuthService } from '../../../core/auth.service';
import {
  AppNotification, ChatUser, Conversation, Message, MessagePage, SendMessageRequest,
} from '../../../core/models/chat.model';
import { ChatApi } from './chat-api';
import { RealtimeService } from './realtime.service';

/*
 * EXAMPLE DATA ONLY. Everything below is fictional seed data so the chat UI can be demoed without a backend
 * (`environment.useMockChat = true`). People, emails (@example.com) and ids are made up.
 * Message texts are translation keys (chat.mock.*), resolved in the current language when the data is first seeded.
 */
const MIN = 60_000;
const SEED_USERS: (Omit<ChatUser, 'title'> & { titleKey: string })[] = [
  { id: 'demo-dana', name: 'Dana Whitfield', email: 'dana.whitfield@example.com', titleKey: 'dispatcher', online: true },
  { id: 'demo-marcos', name: 'Marcos Herrera', email: 'marcos.herrera@example.com', titleKey: 'carrierRep', online: false },
  { id: 'demo-priya', name: 'Priya Nair', email: 'priya.nair@example.com', titleKey: 'auditAnalyst', online: true },
  { id: 'demo-tomas', name: 'Tomás Ibarra', email: 'tomas.ibarra@example.com', titleKey: 'driver', online: true },
  { id: 'demo-lena', name: 'Lena Fischer', email: 'lena.fischer@example.com', titleKey: 'customerService', online: false },
  { id: 'demo-omar', name: 'Omar Haddad', email: 'omar.haddad@example.com', titleKey: 'warehouse', online: false },
  { id: 'demo-sofia', name: 'Sofía Castro', email: 'sofia.castro@example.com', titleKey: 'accountManager', online: true },
];
const FILLER = 6;
const REPLIES = 6;

/** Prefix that makes the mock fail the first send attempt, to demo the failed/retry state. */
export const MOCK_FAIL_PREFIX = '/fail';

/** Id of the current user inside the mock data. */
export const MOCK_ME_ID = 'me';

const clone = <T>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

@Injectable({ providedIn: 'root' })
export class MockChatApi extends ChatApi {
  private readonly auth = inject(AuthService);
  private readonly translate = inject(TranslateService);
  private readonly realtime = inject(RealtimeService);

  /** Simulated network latency. Tests set 0 (synchronous). */
  latencyMs = 250;
  /** Simulated typing + reply after each message you send. */
  autoReplies = true;
  replyTypingMs = 900;
  replyDelayMs = 2600;
  /** One incoming message from a new contact and one shipment notification shortly after start. */
  demoTraffic = true;

  private seeded = false;
  private seq = 0;
  private users: ChatUser[] = [];
  private conversations: Conversation[] = [];
  private messages = new Map<string, Message[]>();
  private notifications: AppNotification[] = [];
  private failedOnce = new Set<string>();
  private t: Record<string, string> = {};

  /** The signed-in user always has this id in mock mode (independent of when Auth0 restores the profile). */
  readonly meId = MOCK_ME_ID;

  private me(): ChatUser {
    const u = this.auth.user();
    return { id: this.meId, name: u?.name ?? u?.email ?? 'Me', email: u?.email ?? '', avatarUrl: u?.picture ?? null };
  }

  // ---- ChatApi ------------------------------------------------------------------------------------------------

  searchUsers(q: string, limit = 8): Observable<ChatUser[]> {
    return this.run(() => {
      const term = q.trim().toLowerCase();
      if (!term) return [];
      return this.users
        .filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
        .slice(0, limit);
    });
  }

  listConversations(): Observable<Conversation[]> {
    return this.run(() => [...this.conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), true);
  }

  openConversation(userId: string): Observable<Conversation> {
    return this.run(() => {
      const existing = this.conversations.find(c => c.participants.some(p => p.id === userId));
      if (existing) return existing;
      const user = this.users.find(u => u.id === userId);
      if (!user) throw new Error('unknown user');
      return this.createConversation(user);
    });
  }

  listMessages(conversationId: string, before?: string | null, limit = 30): Observable<MessagePage> {
    return this.run(() => {
      const all = this.messages.get(conversationId) ?? [];
      let end = before ? all.findIndex(m => m.id === before) : all.length;
      if (end < 0) end = all.length;
      const start = Math.max(0, end - limit);
      return { items: all.slice(start, end), hasMore: start > 0 };
    });
  }

  sendMessage(conversationId: string, req: SendMessageRequest): Observable<Message> {
    return this.run(() => {
      if (req.body.startsWith(MOCK_FAIL_PREFIX) && !this.failedOnce.has(req.clientId)) {
        this.failedOnce.add(req.clientId);
        throw new Error('simulated failure');
      }
      const conv = this.conversations.find(c => c.id === conversationId);
      if (!conv) throw new Error('unknown conversation');
      const msg = this.push(conversationId, this.meId, req.body, Date.now(), req.clientId);
      if (this.autoReplies) this.scheduleReply(conv);
      return msg;
    });
  }

  markConversationRead(conversationId: string): Observable<void> {
    return this.run(() => {
      const conv = this.conversations.find(c => c.id === conversationId);
      if (conv) conv.unreadCount = 0;
      for (const n of this.notifications) if (n.conversationId === conversationId) n.read = true;
      return undefined;
    });
  }

  listNotifications(limit = 50): Observable<AppNotification[]> {
    return this.run(() => [...this.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit));
  }

  markNotificationRead(id: string): Observable<void> {
    return this.run(() => {
      const n = this.notifications.find(x => x.id === id);
      if (n) n.read = true;
      return undefined;
    });
  }

  markAllNotificationsRead(): Observable<void> {
    return this.run(() => {
      for (const n of this.notifications) n.read = true;
      return undefined;
    });
  }

  // ---- internals ----------------------------------------------------------------------------------------------

  /** Seeds lazily (after translations are loaded), applies latency, runs `fn` on subscribe and returns a copy. */
  private run<T>(fn: () => T, startsTraffic = false): Observable<T> {
    return this.ensureSeed().pipe(
      switchMap(() => (this.latencyMs > 0 ? timer(this.latencyMs) : of(0))),
      switchMap(() => defer(() => {
        try {
          const out = clone(fn());
          if (startsTraffic) this.startDemoTraffic();
          return of(out);
        } catch (e) {
          return throwError(() => e);
        }
      })),
    );
  }

  private ensureSeed(): Observable<void> {
    if (this.seeded) return of(undefined);
    const keys = [
      ...SEED_USERS.map(u => `chat.mock.titles.${u.titleKey}`),
      ...Array.from({ length: FILLER }, (_, i) => `chat.mock.filler.${i + 1}`),
      ...Array.from({ length: REPLIES }, (_, i) => `chat.mock.reply.${i + 1}`),
      'chat.mock.seed.dana1', 'chat.mock.seed.me1', 'chat.mock.seed.dana2', 'chat.mock.seed.dana3',
      'chat.mock.seed.marcos1', 'chat.mock.seed.me2', 'chat.mock.seed.priya1', 'chat.mock.incoming.lena',
    ];
    return this.translate.get(keys).pipe(map((t: Record<string, string>) => {
      if (!this.seeded) this.seed(t);
    }));
  }

  private seed(t: Record<string, string>): void {
    this.seeded = true;
    this.t = t;
    const now = Date.now();
    this.users = SEED_USERS.map(({ titleKey, ...u }) => ({ ...u, avatarUrl: null, title: t[`chat.mock.titles.${titleKey}`] }));
    const user = (id: string) => this.users.find(u => u.id === id)!;

    const dana = this.createConversation(user('demo-dana'));
    // Long history so "load earlier messages" (paging upward) can be demoed.
    for (let i = 0; i < 60; i++) {
      const from = i % 3 === 0 ? this.meId : dana.participants[1].id;
      this.push(dana.id, from, t[`chat.mock.filler.${(i % FILLER) + 1}`], now - (3 * 24 * 60 - i * 40) * MIN);
    }
    this.push(dana.id, 'demo-dana', t['chat.mock.seed.dana1'], now - 32 * MIN);
    this.push(dana.id, this.meId, t['chat.mock.seed.me1'], now - 30 * MIN);
    this.push(dana.id, 'demo-dana', t['chat.mock.seed.dana2'], now - 6 * MIN);
    const d3 = this.push(dana.id, 'demo-dana', t['chat.mock.seed.dana3'], now - 5 * MIN);
    dana.unreadCount = 2;

    const marcos = this.createConversation(user('demo-marcos'));
    this.push(marcos.id, 'demo-marcos', t['chat.mock.seed.marcos1'], now - 26 * 60 * MIN);
    this.push(marcos.id, this.meId, t['chat.mock.seed.me2'], now - 25 * 60 * MIN);

    const priya = this.createConversation(user('demo-priya'));
    const p1 = this.push(priya.id, 'demo-priya', t['chat.mock.seed.priya1'], now - 48 * MIN);
    priya.unreadCount = 1;

    const iso = (ms: number) => new Date(now - ms).toISOString();
    this.notifications = [
      this.messageNotification(d3, user('demo-dana'), false),
      this.messageNotification(p1, user('demo-priya'), false),
      {
        id: 'demo-n-order', type: 'order', title: '', titleKey: 'notifications.mock.orderCreated.title',
        bodyKey: 'notifications.mock.orderCreated.body', params: { id: 'ORD-1042' }, createdAt: iso(55 * MIN),
        read: false, link: '/orders',
      },
      {
        id: 'demo-n-shipment', type: 'shipment', title: '', titleKey: 'notifications.mock.shipmentDelayed.title',
        bodyKey: 'notifications.mock.shipmentDelayed.body', params: { id: 'SHP-1188', h: 2 }, createdAt: iso(3 * 60 * MIN),
        read: false, link: '/tracking',
      },
      {
        id: 'demo-n-system', type: 'system', title: '', titleKey: 'notifications.mock.maintenance.title',
        bodyKey: 'notifications.mock.maintenance.body', createdAt: iso(2 * 60 * MIN), read: true, link: null,
      },
    ];
  }

  private messageNotification(m: Message, from: ChatUser, read: boolean): AppNotification {
    return {
      id: `msg-${m.id}`, type: 'message', title: from.name, body: m.body, titleKey: 'notifications.messageFrom',
      params: { name: from.name }, createdAt: m.createdAt, read, conversationId: m.conversationId, refId: m.id,
    };
  }

  private createConversation(user: ChatUser): Conversation {
    const conv: Conversation = {
      id: `demo-c-${user.id.replace(/^demo-/, '')}`,
      participants: [this.me(), user],
      lastMessage: null,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };
    this.conversations.push(conv);
    this.messages.set(conv.id, []);
    return conv;
  }

  private push(conversationId: string, senderId: string, body: string, at: number, clientId?: string): Message {
    const msg: Message = {
      id: `demo-m-${++this.seq}`, conversationId, senderId, body, createdAt: new Date(at).toISOString(), clientId: clientId ?? null,
    };
    this.messages.get(conversationId)!.push(msg);
    const conv = this.conversations.find(c => c.id === conversationId)!;
    conv.lastMessage = msg;
    conv.updatedAt = msg.createdAt;
    return msg;
  }

  /** Simulates the other person typing and answering (delivered through RealtimeService like a hub event). */
  private scheduleReply(conv: Conversation): void {
    const peer = conv.participants.find(p => p.id !== this.meId);
    if (!peer) return;
    setTimeout(() => this.realtime.emit({ type: 'typing', conversationId: conv.id, userId: peer.id, userName: peer.name }), this.replyTypingMs);
    setTimeout(() => this.incoming(conv.id, peer.id, this.t[`chat.mock.reply.${1 + Math.floor(Math.random() * REPLIES)}`]), this.replyDelayMs);
  }

  /** A message from someone else arrives "from the server". */
  incoming(conversationId: string, senderId: string, body: string): Message {
    const msg = this.push(conversationId, senderId, body, Date.now());
    const conv = this.conversations.find(c => c.id === conversationId)!;
    conv.unreadCount++;
    this.realtime.emit({ type: 'message', message: clone(msg) });
    return msg;
  }

  private trafficStarted = false;
  private startDemoTraffic(): void {
    if (!this.demoTraffic || this.trafficStarted) return;
    this.trafficStarted = true;
    setTimeout(() => {
      const lena = this.users.find(u => u.id === 'demo-lena')!;
      const conv = this.conversations.find(c => c.participants.some(p => p.id === lena.id)) ?? this.createConversation(lena);
      this.incoming(conv.id, lena.id, this.t['chat.mock.incoming.lena']);
    }, 20_000);
    setTimeout(() => {
      const n: AppNotification = {
        id: `demo-n-${Date.now()}`, type: 'shipment', title: '', titleKey: 'notifications.mock.delivered.title',
        bodyKey: 'notifications.mock.delivered.body', params: { id: 'SHP-1201' }, createdAt: new Date().toISOString(),
        read: false, link: '/tracking',
      };
      this.notifications.push(n);
      this.realtime.emit({ type: 'notification', notification: clone(n) });
    }, 45_000);
  }
}
