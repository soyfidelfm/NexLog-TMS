import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClient, PagedResult } from '../../../core/api/api-client.service';
import {
  AppNotification, ChatUser, Conversation, Message, MessagePage, OpenConversationRequest, SendMessageRequest,
} from '../../../core/models/chat.model';
import { ChatApi } from './chat-api';

/** Accepts either a bare array or the standard PagedResult envelope. */
function unwrap<T>(res: T[] | PagedResult<T> | null | undefined): T[] {
  if (Array.isArray(res)) return res;
  return res?.items ?? [];
}

/**
 * Real backend. Every call is `silent` (SKIP_LOADING): chat, typeahead and notifications are background traffic and
 * must never raise the global loading overlay. The Auth0 interceptor adds the Bearer token (path is under apiUrl).
 */
@Injectable({ providedIn: 'root' })
export class HttpChatApi extends ChatApi {
  private readonly api = inject(ApiClient);
  private readonly silent = { silent: true };

  searchUsers(q: string, limit = 8): Observable<ChatUser[]> {
    return this.api
      .get<ChatUser[] | PagedResult<ChatUser>>(`users/search?q=${encodeURIComponent(q)}&limit=${limit}`, this.silent)
      .pipe(map(unwrap));
  }

  listConversations(): Observable<Conversation[]> {
    return this.api.get<Conversation[] | PagedResult<Conversation>>('chat/conversations', this.silent).pipe(map(unwrap));
  }

  openConversation(userId: string): Observable<Conversation> {
    const body: OpenConversationRequest = { userId };
    return this.api.post<Conversation>('chat/conversations', body, this.silent);
  }

  listMessages(conversationId: string, before?: string | null, limit = 30): Observable<MessagePage> {
    const qs = `limit=${limit}` + (before ? `&before=${encodeURIComponent(before)}` : '');
    return this.api
      .get<MessagePage>(`chat/conversations/${encodeURIComponent(conversationId)}/messages?${qs}`, this.silent)
      .pipe(map(p => ({ items: p?.items ?? [], hasMore: !!p?.hasMore })));
  }

  sendMessage(conversationId: string, req: SendMessageRequest): Observable<Message> {
    return this.api.post<Message>(`chat/conversations/${encodeURIComponent(conversationId)}/messages`, req, this.silent);
  }

  markConversationRead(conversationId: string): Observable<void> {
    return this.api
      .post<void>(`chat/conversations/${encodeURIComponent(conversationId)}/read`, {}, this.silent)
      .pipe(map(() => undefined));
  }

  listNotifications(limit = 50): Observable<AppNotification[]> {
    return this.api
      .get<AppNotification[] | PagedResult<AppNotification>>(`notifications?limit=${limit}`, this.silent)
      .pipe(map(unwrap));
  }

  markNotificationRead(id: string): Observable<void> {
    return this.api.post<void>(`notifications/${encodeURIComponent(id)}/read`, {}, this.silent).pipe(map(() => undefined));
  }

  markAllNotificationsRead(): Observable<void> {
    return this.api.post<void>('notifications/read-all', {}, this.silent).pipe(map(() => undefined));
  }
}
