import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RealtimeEvent } from '../../../core/models/chat.model';
import { chatTestProviders } from './chat-testing';
import { MOCK_FAIL_PREFIX, MOCK_ME_ID, MockChatApi } from './mock-chat-api';
import { RealtimeService } from './realtime.service';

describe('MockChatApi', () => {
  let api: MockChatApi;
  let events: RealtimeEvent[];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: chatTestProviders() });
    api = TestBed.inject(MockChatApi);
    api.latencyMs = 0;
    api.demoTraffic = false;
    events = [];
    TestBed.inject(RealtimeService).events$.subscribe(e => events.push(e));
  });
  afterEach(() => vi.useRealTimers());

  it('seeds example conversations, newest first, including the current user', async () => {
    const convs = await firstValueFrom(api.listConversations());
    expect(convs.length).toBe(3);
    expect(convs[0].updatedAt >= convs[1].updatedAt).toBe(true);
    expect(convs.every(c => c.participants.some(p => p.id === MOCK_ME_ID))).toBe(true);
    expect(convs.reduce((n, c) => n + c.unreadCount, 0)).toBe(3);
  });

  it('pages history upward with a before cursor', async () => {
    const convs = await firstValueFrom(api.listConversations());
    const dana = convs.find(c => c.id === 'demo-c-dana')!;
    const p1 = await firstValueFrom(api.listMessages(dana.id, null, 30));
    expect(p1.items.length).toBe(30);
    expect(p1.hasMore).toBe(true);
    expect(p1.items[29].id).toBe(dana.lastMessage!.id);
    const p2 = await firstValueFrom(api.listMessages(dana.id, p1.items[0].id, 30));
    expect(p2.items.length).toBe(30);
    expect(p2.items[29].createdAt <= p1.items[0].createdAt).toBe(true);
    const p3 = await firstValueFrom(api.listMessages(dana.id, p2.items[0].id, 30));
    expect(p3.hasMore).toBe(false);
    expect(p1.items.length + p2.items.length + p3.items.length).toBe(64);
  });

  it('searches users by name or email', async () => {
    expect((await firstValueFrom(api.searchUsers('fisch'))).map(u => u.name)).toEqual(['Lena Fischer']);
    expect((await firstValueFrom(api.searchUsers('omar.haddad@'))).length).toBe(1);
    expect(await firstValueFrom(api.searchUsers('   '))).toEqual([]);
  });

  it('openConversation is idempotent and creates new 1:1 conversations', async () => {
    const a = await firstValueFrom(api.openConversation('demo-omar'));
    const b = await firstValueFrom(api.openConversation('demo-omar'));
    expect(a.id).toBe(b.id);
    expect((await firstValueFrom(api.listConversations())).length).toBe(4);
  });

  it('sends a message, echoes the clientId and simulates typing + a reply', async () => {
    vi.useFakeTimers();
    const sent = await firstValueFrom(api.sendMessage('demo-c-marcos', { body: 'hola', clientId: 'cid-1' }));
    expect(sent.clientId).toBe('cid-1');
    expect(sent.senderId).toBe(MOCK_ME_ID);
    vi.advanceTimersByTime(api.replyTypingMs);
    expect(events.map(e => e.type)).toEqual(['typing']);
    vi.advanceTimersByTime(api.replyDelayMs);
    const reply = events.find(e => e.type === 'message');
    expect(reply && reply.type === 'message' && reply.message.senderId).toBe('demo-marcos');
  });

  it(`fails the first attempt of a "${MOCK_FAIL_PREFIX}" message and accepts the retry`, async () => {
    api.autoReplies = false;
    await expect(firstValueFrom(api.sendMessage('demo-c-marcos', { body: `${MOCK_FAIL_PREFIX} x`, clientId: 'c2' }))).rejects.toThrow();
    const ok = await firstValueFrom(api.sendMessage('demo-c-marcos', { body: `${MOCK_FAIL_PREFIX} x`, clientId: 'c2' }));
    expect(ok.clientId).toBe('c2');
  });
});
