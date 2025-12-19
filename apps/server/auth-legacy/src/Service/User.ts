import {
  FailServerResponse,
  type ServerResponse,
  SuccessfulServerResponse,
} from '@module/classes';

import {getUser} from '../Database/index.js';
import {getSaltedPassword} from '../Function/index.js';

export async function loginService(
  username: string,
  password: string,
): Promise<ServerResponse<void>> {
  const serverResponse = await getUser(username);

  if (serverResponse.isSuccessful) {
    const {data} = serverResponse;
    const {password: expectedPassword} = data;
    if (getSaltedPassword(username, password) === expectedPassword) {
      // 加盐后与数据库密码比对
      return new SuccessfulServerResponse(undefined);
    } else {
      return new FailServerResponse('用户名或密码错误');
    }
  } else {
    const {message} = serverResponse;
    return new FailServerResponse(message);
  }
}

export function checkSessionService(
  usernameInSession: unknown,
): ServerResponse<{isInSession: boolean}> {
  return new SuccessfulServerResponse({
    isInSession: typeof usernameInSession === 'string',
  });
}
