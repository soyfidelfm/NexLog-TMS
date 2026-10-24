/**
 * Chat / notification models and the DTO contract the backend must implement
 * (see features/chat/README.md for the endpoint + SignalR hub contract).
 * All timestamps are ISO-8601 strings (UTC).
 */

/** A system user that can be messaged. `id` is the Auth0 `sub` (the JWT subject the backend sees). */
export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  /** Job title / role label shown under the name (free text from the backend). */
  title?: string | null;
  online?: boolean | null;
}

/** `sending` and `failed` exist only on the client (optimistic send); server messages have no status. */
export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  /** Client-generated id echoed back by the server so optimistic messages can be reconciled. */
  clientId?: string | null;
  status?: MessageStatus;
}

/** 1:1 conversation. `participants` includes the current user. */
export interface Conversation {
  id: string;
  participants: ChatUser[];
  lastMessage: Message | null;
  /** Messages from others the current user has not read yet. */
  unreadCount: number;
  updatedAt: string;
}

export type NotificationType = 'message' | 'order' | 'shipment' | 'system';

/** Named `AppNotification` to avoid clashing with the DOM `Notification` type. */
export interface AppNotification {
  id: string;
  type: NotificationType;
  /** Plain text from the server. Ignored when `titleKey` is set. */
  title: string;
  body?: string | null;
  /** Optional ngx-translate keys (+ params) so the client can localize the text. */
  titleKey?: string | null;
  bodyKey?: string | null;
  params?: Record<string, string | number> | null;
  createdAt: string;
  read: boolean;
  /** In-app route to open on click, e.g. `/orders/ORD-1042`. */
  link?: string | null;
  /** For `message` notifications: the conversation to open. */
  conversationId?: string | null;
  /** Id of the thing that caused it (e.g. the message id); used to de-duplicate against realtime messages. */
  refId?: string | null;
}

// ---- DTOs -------------------------------------------------------------------------------------------------------

export interface SendMessageRequest {
  body: string;
  clientId: string;
}

export interface OpenConversationRequest {
  userId: string;
}

/** A page of history, `items` ordered oldest -> newest. `hasMore` = older messages exist before `items[0]`. */
export interface MessagePage {
  items: Message[];
  hasMore: boolean;
}

// ---- Realtime (SignalR) events ---------------------------------------------------------------------------------

export type RealtimeEvent =
  | { type: 'message'; message: Message }
  | { type: 'typing'; conversationId: string; userId: string; userName?: string | null }
  | { type: 'read'; conversationId: string; userId: string }
  | { type: 'notification'; notification: AppNotification }
  /** Emitted after (re)connecting so stores can refetch what they missed while offline. */
  | { type: 'resync' };
