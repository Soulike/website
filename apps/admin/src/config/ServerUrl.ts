export const AUTH_SERVER_URL = process.env.production
  ? new URL('http://auth-server')
  : new URL('http://localhost:3000/server/account/');
