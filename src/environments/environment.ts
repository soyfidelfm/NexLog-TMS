export const environment = {
  production: false,
  /** NexLog API Gateway (backend/src/ApiGateway). All calls under this URL get the Auth0 access token. */
  apiUrl: 'http://localhost:5100/api',
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
