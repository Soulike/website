import {
  type LoginCredentials,
  LoginCredentialsSchema,
  type Session,
  SessionSchema,
} from '@schema/auth';
import {StatusCodes} from 'http-status-codes';

import {CreateSessionResult} from './types.js';

// Sync with auth server.
export const AUTH_URL = new URL('https://auth.soulike.tech/session');

export async function getSession(): Promise<Session | null> {
  const response = await fetch(AUTH_URL, {
    method: 'GET',
    credentials: 'include',
  });
  if (Object.is(response.status, StatusCodes.NOT_FOUND)) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Get session failed with HTTP status ${response.status}`);
  }
  const session: unknown = await response.json();
  const parsedSession = SessionSchema.safeParse(session);
  if (!parsedSession.success) {
    throw new Error(`Invalid Session`);
  }
  return parsedSession.data;
}

export async function createSession(
  credentials: LoginCredentials,
): Promise<CreateSessionResult> {
  const parsedCredentials = LoginCredentialsSchema.parse(credentials);
  const response = await fetch(AUTH_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(parsedCredentials),
  });
  if (response.ok) {
    return CreateSessionResult.SUCCESS;
  }
  if (Object.is(response.status, StatusCodes.UNAUTHORIZED)) {
    return CreateSessionResult.UNAUTHORIZED;
  }
  throw new Error(`Create session failed with HTTP status ${response.status}`);
}

export async function deleteSession(): Promise<void> {
  const response = await fetch(AUTH_URL, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(
      `Delete session failed with HTTP status ${response.status}`,
    );
  }
}
