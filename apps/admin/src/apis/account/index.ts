import * as request from '@website/request';
import {message} from 'antd';

import {CHECK_SESSION, LOGIN, LOGOUT} from './ROUTE';

export async function login(
  username: string,
  password: string,
): Promise<true | null> {
  return await request.postServerResponse(
    LOGIN,
    {username, password},
    {
      onRequestFail: (msg) => message.warning(msg),
      onRequestError: (msg) => message.error(msg),
    },
  );
}

export async function logout(): Promise<true | null> {
  return await request.postServerResponse(
    LOGOUT,
    {},
    {
      onRequestFail: (msg) => message.warning(msg),
      onRequestError: (msg) => message.error(msg),
    },
  );
}

export async function checkSession(): Promise<{isInSession: boolean} | null> {
  return await request.getServerResponse(CHECK_SESSION, {
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}
