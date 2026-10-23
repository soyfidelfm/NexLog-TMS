import { Observable } from 'rxjs';
import {
  AppNotification, ChatUser, Conversation, Message, MessagePage, SendMessageRequest,
} from '../../../core/models/chat.model';

/**
 * Data layer for chat, user search and notifications.
 * Two implementations: `HttpChatApi` (real backend) and `MockChatApi` (in-memory example data).
 * `ChatBackend` picks one from `environment.useMockChat`; everything else only talks to this contract.
 */
export abstract class ChatApi {
  /** GET /api/users/search?q=&limit= */
  abstract searchUsers(q: string, limit?: number): Observable<ChatUser[]>;
  /** GET /api/chat/conversations, newest activity first */
  abstract listConversations(): Observable<Conversation[]>;
  /** POST /api/chat/conversations {userId}; returns the existing 1:1 conversation or creates it (idempotent) */
  abstract openConversation(userId: string): Observable<Conversation>;
  /** GET /api/chat/conversations/{id}/messages?before=<messageId>&limit= */
  abstract listMessages(conversationId: string, before?: string | null, limit?: number): Observable<MessagePage>;
  /** POST /api/chat/conversations/{id}/messages */
  abstract sendMessage(conversationId: string, req: SendMessageRequest): Observable<Message>;
  /** POST /api/chat/conversations/{id}/read */
  abstract markConversationRead(conversationId: string): Observable<void>;
  /** GET /api/notifications?limit= */
  abstract listNotifications(limit?: number): Observable<AppNotification[]>;
  /** POST /api/notifications/{id}/read */
  abstract markNotificationRead(id: string): Observable<void>;
  /** POST /api/notifications/read-all */
  abstract markAllNotificationsRead(): Observable<void>;
}
