import {ServerResponse} from '@website/classes';
import {Request} from '@website/request';

import {CHECK_SESSION, LOGIN, LOGOUT} from './ROUTE';

export async function login(
  username: string,
  password: string,
): Promise<ServerResponse<void>> {
  return Request.JSONToJSON.post(LOGIN, {
    body: {username, password},
  });
}

export async function logout(): Promise<ServerResponse<void>> {
  return Request.JSONToJSON.post(LOGOUT);
}

export async function checkSession(): Promise<
  ServerResponse<{isInSession: boolean}>
> {
  return Request.JSONToJSON.get(CHECK_SESSION);
}
