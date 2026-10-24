import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastService } from '../../../shared/toast/toast.service';
import { ChatService } from './chat.service';
import { chatTestProviders } from './chat-testing';
import { MOCK_ME_ID, MockChatApi } from './mock-chat-api';
import { NotificationService } from './notification.service';

describe('ChatService (mock data layer)', () => {
  let chat: ChatService;
  let mock: MockChatApi;
  let toasts: ToastService;
  let notes: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: chatTestProviders() });
    mock = TestBed.inject(MockChatApi);
    mock.latencyMs = 0;
    mock.demoTraffic = false;
    mock.autoReplies = false;
    chat = TestBed.inject(ChatService);
    toasts = TestBed.inject(ToastService);
    notes = TestBed.inject(NotificationService);
    chat.start();
  });
  afterEach(() => vi.useRealTimers());

  it('loads conversations and totals the unread badge', () => {
    expect(chat.mode()).toBe('mock');
    expect(chat.me().id).toBe(MOCK_ME_ID);
    expect(chat.conversations().length).toBe(3);
    expect(chat.totalUnread()).toBe(3);
  });

  it('opening a thread loads the latest page and marks it read', () => {
    chat.openConversation('demo-c-dana');
    expect(chat.panelOpen()).toBe(true);
    expect(chat.activeMessages().length).toBe(30);
    expect(chat.activeHasMore()).toBe(true);
    expect(chat.totalUnread()).toBe(1);
    chat.loadOlder('demo-c-dana');
    expect(chat.activeMessages().length).toBe(60);
  });

  it('sends optimistically and reconciles with the server copy', () => {
    chat.openConversation('demo-c-marcos');
    const before = chat.activeMessages().length;
    chat.send('demo-c-marcos', '  hello there  ');
    const msgs = chat.activeMessages();
    expect(msgs.length).toBe(before + 1);
    const last = msgs[msgs.length - 1];
    expect(last.body).toBe('hello there');
    expect(last.status).toBe('sent');
    expect(last.id.startsWith('demo-m-')).toBe(true);
    expect(chat.conversations()[0].id).toBe('demo-c-marcos');
  });

  it('marks failed sends and retries them', () => {
    chat.openConversation('demo-c-marcos');
    const spy = vi.spyOn(mock, 'sendMessage').mockReturnValueOnce(throwError(() => new Error('offline')));
    chat.send('demo-c-marcos', 'will fail');
    let last = chat.activeMessages().at(-1)!;
    expect(last.status).toBe('failed');
    expect(last.id.startsWith('tmp-')).toBe(true);
    chat.retry('demo-c-marcos', last.clientId!);
    last = chat.activeMessages().at(-1)!;
    expect(last.status).toBe('sent');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(chat.activeMessages().filter(m => m.body === 'will fail').length).toBe(1);
  });

  it('ignores blank messages', () => {
    chat.openConversation('demo-c-marcos');
    const before = chat.activeMessages().length;
    chat.send('demo-c-marcos', '   ');
    expect(chat.activeMessages().length).toBe(before);
  });

  it('an incoming message for an unfocused thread bumps unread, adds a bell entry and shows a toast', () => {
    const unread = chat.totalUnread();
    const bell = notes.unreadCount();
    mock.incoming('demo-c-marcos', 'demo-marcos', 'ping');
    expect(chat.totalUnread()).toBe(unread + 1);
    expect(notes.unreadCount()).toBe(bell + 1);
    expect(toasts.toasts().length).toBe(1);
    expect(toasts.toasts()[0].message).toBe('ping');
    // Clicking the toast opens that conversation.
    toasts.activate(toasts.toasts()[0].id);
    expect(chat.activeId()).toBe('demo-c-marcos');
    expect(chat.panelOpen()).toBe(true);
  });

  it('an incoming message for the focused thread is read immediately, without a toast', () => {
    chat.openConversation('demo-c-marcos');
    chat.windowFocused.set(true);
    const unread = chat.totalUnread();
    mock.incoming('demo-c-marcos', 'demo-marcos', 'seen');
    expect(chat.totalUnread()).toBe(unread);
    expect(toasts.toasts().length).toBe(0);
    expect(chat.activeMessages().at(-1)!.body).toBe('seen');
  });

  it('still toasts when the window is not focused', () => {
    chat.openConversation('demo-c-marcos');
    chat.windowFocused.set(false);
    mock.incoming('demo-c-marcos', 'demo-marcos', 'away');
    expect(toasts.toasts().length).toBe(1);
  });

  it('fetches an unknown conversation when its first message arrives', () => {
    expect(chat.conversations().some(c => c.id === 'demo-c-lena')).toBe(false);
    (mock as unknown as { createConversation(u: unknown): unknown }).createConversation(
      { id: 'demo-lena', name: 'Lena Fischer', email: 'lena.fischer@example.com' });
    mock.incoming('demo-c-lena', 'demo-lena', 'hi');
    expect(chat.conversations().some(c => c.id === 'demo-c-lena')).toBe(true);
    expect(chat.conversations().find(c => c.id === 'demo-c-lena')!.unreadCount).toBe(1);
    expect(toasts.toasts().length).toBe(1);
  });

  it('shows and expires the typing indicator', () => {
    vi.useFakeTimers();
    mock.autoReplies = true;
    chat.openConversation('demo-c-marcos');
    chat.send('demo-c-marcos', 'hey');
    vi.advanceTimersByTime(mock.replyTypingMs);
    expect(chat.typing()['demo-c-marcos']?.name).toBe('Marcos Herrera');
    vi.advanceTimersByTime(mock.replyDelayMs - mock.replyTypingMs);
    expect(chat.typing()['demo-c-marcos']).toBeUndefined();
  });

  it('starting a chat with a user reuses or creates the conversation', () => {
    chat.startWith({ id: 'demo-priya', name: 'Priya Nair', email: 'priya.nair@example.com' });
    expect(chat.activeId()).toBe('demo-c-priya');
    chat.startWith({ id: 'demo-omar', name: 'Omar Haddad', email: 'omar.haddad@example.com' });
    expect(chat.activeId()).toBe('demo-c-omar');
    expect(chat.conversations().length).toBe(4);
  });
});
