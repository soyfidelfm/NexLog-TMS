export const environment = {
  production: false,
  /** NexLog API Gateway (backend/src/ApiGateway). All calls under this URL get the Auth0 access token. */
  apiUrl: 'http://localhost:5100/api',
  /** SignalR hub (served by the gateway). Used only when `useMockChat` is false. */
  hubUrl: 'http://localhost:5100/hubs/notifications',
  /**
   * Chat + notifications data layer. `true` = in-memory example data with simulated replies (no backend needed).
   * Set to `false` to use the real API (`/api/chat/*`, `/api/users/search`, `/api/notifications/*` + the SignalR hub).
   */
  useMockChat: true,
  /** With `useMockChat: false`, switch to the mock layer automatically if the chat endpoints are unreachable / 404. */
  chatMockFallback: true,
  auth0: {
    domain: 'dev-fidelfm.us.auth0.com',
    clientId: 'sIFP0DQPkWTDjkfikEmfv90xaptToZUE',
    /**
     * API Identifier of the Auth0 API (Auth0 Dashboard > Applications > APIs > Create API).
     * MUST match the backend setting Auth0:Audience. Without an audience Auth0 issues an opaque
     * token that the backend cannot validate.
     */
    audience: 'https://api.nexlog-tms'
  }
};
