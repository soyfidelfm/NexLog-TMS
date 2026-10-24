# Chat, notifications & toasts

Messenger-style chat (header 💬 button), notification bell, `/notifications` page and toasts.

## Switching data layer

`src/environments/environment.ts`

| flag | default | meaning |
| --- | --- | --- |
| `useMockChat` | `true` | In-memory **example data** (`services/mock-chat-api.ts`) with simulated typing/replies. No backend needed. |
| `chatMockFallback` | `true` | With `useMockChat: false`, if the endpoints answer 0/404/501/502/503/504 the app falls back to the mock once (panel shows "Demo data"). |
| `hubUrl` | `http://localhost:5100/hubs/notifications` | SignalR hub, live mode only. |

Going live = `useMockChat: false` (one line).

## Architecture

```
ChatPanel / Thread / NewChat / NotificationBell / NotificationsPage   (UI, OnPush + signals)
        │
ChatService ── NotificationService ── ToastService (shared/toast) ── DesktopNotifyService
   │   UserService (typeahead)
   │
ChatBackend ── picks ──> HttpChatApi (ApiClient, all calls { silent: true })
   │                     MockChatApi (example data)
RealtimeService ── events$ <── SignalR hub (live)  |  MockChatApi.emit (mock)
```

All chat/search/notification HTTP calls use `ApiClient` with `{ silent: true }` (SKIP_LOADING), so the global
loading overlay never appears while chatting. The Auth0 interceptor adds the Bearer token (paths are under `apiUrl`).

## Backend contract (assumed — to be implemented by the Notification/Chat service behind the gateway)

All routes require the Auth0 JWT; the current user is the token `sub`. JSON camelCase, ISO-8601 UTC dates.
Types are in `src/app/core/models/chat.model.ts`.

| method | route | body / query | response |
| --- | --- | --- | --- |
| GET | `/api/users/search` | `q` (name or email, min 2 chars), `limit` (default 8) | `ChatUser[]` (a `PagedResult<ChatUser>` is also accepted). Should exclude inactive users; the client also hides the caller. |
| GET | `/api/chat/conversations` | – | `Conversation[]`, newest activity first, `unreadCount` per caller |
| POST | `/api/chat/conversations` | `{ userId }` | `Conversation` — returns the existing 1:1 conversation or creates it (idempotent) |
| GET | `/api/chat/conversations/{id}/messages` | `before` (message id, optional), `limit` (default 30) | `{ items: Message[] /* oldest→newest */, hasMore }` |
| POST | `/api/chat/conversations/{id}/messages` | `{ body, clientId }` (body ≤ 2000 chars) | `Message` — must echo `clientId` |
| POST | `/api/chat/conversations/{id}/read` | – | 204; also marks that conversation's message notifications read |
| GET | `/api/notifications` | `limit` (default 50) | `AppNotification[]` newest first |
| POST | `/api/notifications/{id}/read` | – | 204 |
| POST | `/api/notifications/read-all` | – | 204 |

```ts
ChatUser        { id /* Auth0 sub */, name, email, avatarUrl?, title?, online? }
Message         { id, conversationId, senderId, body, createdAt, clientId? }
Conversation    { id, participants: ChatUser[] /* incl. caller */, lastMessage: Message | null, unreadCount, updatedAt }
AppNotification { id, type: 'message'|'order'|'shipment'|'system', title, body?, titleKey?, bodyKey?, params?,
                  createdAt, read, link? /* in-app route */, conversationId?, refId? /* e.g. message id */ }
```

### SignalR hub `/hubs/notifications`

* Auth: the client sends the Auth0 access token via `accessTokenFactory` → SignalR puts it in the `access_token`
  query string for WebSockets. The backend `JwtBearerEvents.OnMessageReceived` must read it for `/hubs/*`, and the
  gateway (YARP) must proxy WebSockets for `/hubs/{**catch-all}`. CORS must allow `http://localhost:4200` with credentials.
* Use `Clients.User(sub)` (user identifier = `sub` claim).

| direction | method | payload |
| --- | --- | --- |
| server → client | `MessageReceived` | `Message` — to every participant (including the sender's other tabs) |
| server → client | `TypingStarted` | `{ conversationId, userId, userName? }` — to the other participants |
| server → client | `MessagesRead` | `{ conversationId, userId }` (reserved for read receipts, not rendered yet) |
| server → client | `NotificationReceived` | `AppNotification` (order / shipment / system; a `message` one is optional — de-duplicated by `refId`) |
| client → server | `Typing` | `conversationId` (throttled to one call / 2.5 s) |

After every (re)connect the client refetches conversations and notifications (`resync`).

## Out of scope / future

* **Auth0 Management API user search**: it needs a machine-to-machine secret and has strict rate limits, so it must
  never be called from the browser. The backend `/api/users/search` should read a local user table (synced from
  Auth0 on login or via an Auth0 Action/Log Stream) or proxy the Management API server-side.
* **Background push (FCM)** when the app is closed. Today: in-app toasts + optional OS notifications while the tab is
  hidden ("Enable desktop alerts" in the bell, permission asked only on click).
* Group chats, attachments, read receipts, message edit/delete.

## Demo (mock mode)

* Dana and Priya have unread messages; Dana's thread has 64 messages (scroll up to page older ones).
* Every message you send gets "typing…" and a reply ~3 s later. Close the panel before the reply to see the toast.
* Start a message with `/fail` to see the failed state; **Retry** sends it.
* ~20 s after start a new contact (Lena) writes to you; ~45 s after start a shipment notification arrives.
