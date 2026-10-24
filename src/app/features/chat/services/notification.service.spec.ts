import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppNotification } from '../../../core/models/chat.model';
import { ToastService } from '../../../shared/toast/toast.service';
import { chatTestProviders } from './chat-testing';
import { MockChatApi } from './mock-chat-api';
import { NotificationService } from './notification.service';

const note = (id: string, p: Partial<AppNotification> = {}): AppNotification => ({
  id, type: 'order', title: id, createdAt: new Date(Date.now() - Number(id.replace(/\D/g, '') || 0) * 1000).toISOString(), read: false, ...p,
});

describe('NotificationService', () => {
  let svc: NotificationService;
  let toasts: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: chatTestProviders() });
    const mock = TestBed.inject(MockChatApi);
    mock.latencyMs = 0;
    mock.demoTraffic = false;
    svc = TestBed.inject(NotificationService);
    toasts = TestBed.inject(ToastService);
  });

  it('loads the (example) notifications and counts the unread ones', () => {
    svc.load();
    expect(svc.loaded()).toBe(true);
    expect(svc.items().length).toBe(5);
    expect(svc.unreadCount()).toBe(4);
  });

  it('markRead / markAllRead update the unread count', () => {
    svc.ingest(note('n1'), { toast: false });
    svc.ingest(note('n2'), { toast: false });
    svc.ingest(note('n3', { read: true }), { toast: false });
    expect(svc.unreadCount()).toBe(2);
    svc.markRead('n1');
    expect(svc.unreadCount()).toBe(1);
    svc.markRead('n1');
    expect(svc.unreadCount()).toBe(1);
    svc.markAllRead();
    expect(svc.unreadCount()).toBe(0);
  });

  it('de-duplicates by id and by refId', () => {
    expect(svc.ingest(note('n1', { refId: 'm-1', type: 'message' }), { toast: false })).toBe(true);
    expect(svc.ingest(note('n1'), { toast: false })).toBe(false);
    expect(svc.ingest(note('other', { refId: 'm-1', type: 'message' }), { toast: false })).toBe(false);
    expect(svc.items().length).toBe(1);
  });

  it('suppressed message refs are marked read and later copies are ignored', () => {
    svc.ingest(note('n1', { refId: 'm-1', type: 'message' }), { toast: false });
    svc.suppress('m-1');
    expect(svc.unreadCount()).toBe(0);
    svc.suppress('m-2');
    expect(svc.ingest(note('n2', { refId: 'm-2', type: 'message' }))).toBe(false);
  });

  it('marks a conversation\'s message notifications read', () => {
    svc.ingest(note('n1', { type: 'message', conversationId: 'c1' }), { toast: false });
    svc.ingest(note('n2', { type: 'message', conversationId: 'c2' }), { toast: false });
    svc.ingest(note('n3', { type: 'order' }), { toast: false });
    svc.markConversationRead('c1');
    expect(svc.items().filter(n => !n.read).map(n => n.id).sort()).toEqual(['n2', 'n3']);
  });

  it('toasts generic notifications by default but not message ones', () => {
    svc.ingest(note('n1', { type: 'shipment' }));
    svc.ingest(note('n2', { type: 'message' }));
    expect(toasts.toasts().length).toBe(1);
  });

  it('keeps newest first', () => {
    svc.ingest(note('n5'), { toast: false });
    svc.ingest(note('n1'), { toast: false });
    svc.ingest(note('n9'), { toast: false });
    expect(svc.items().map(n => n.id)).toEqual(['n1', 'n5', 'n9']);
  });
});
