import {ServerResponse} from '@website/classes';
import * as request from '@website/request';

import {CHECK_SESSION, LOGIN, LOGOUT} from './ROUTE';

export async function login(
  username: string,
  password: string,
): Promise<ServerResponse<void>> {
  return request.postJson(LOGIN, {
    body: {username, password},
  });
}

export async function logout(): Promise<ServerResponse<void>> {
  return request.postJson(LOGOUT);
}

export async function checkSession(): Promise<
  ServerResponse<{isInSession: boolean}>
> {
  return request.getJson(CHECK_SESSION);
}
