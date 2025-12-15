import {
  FailServerResponse,
  type ServerResponse,
  SuccessfulServerResponse,
  type User,
} from '@module/classes';

import {User as UserTable} from '../Database/index.js';

export async function add(user: User): Promise<ServerResponse<void>> {
  const {username} = user;
  if ((await UserTable.count({username})) !== 0) {
    return new FailServerResponse('用户名已存在，请修改用户名');
  }
  await UserTable.insert(user);
  return new SuccessfulServerResponse(undefined);
}

export async function get(username: string): Promise<ServerResponse<User>> {
  const user = await UserTable.selectByUsername(username);
  if (user === null) {
    return new FailServerResponse('用户不存在');
  }
  return new SuccessfulServerResponse(user);
}

export async function modify(
  user: Partial<User> & Pick<User, 'username'>,
): Promise<ServerResponse<void>> {
  const {username} = user;
  if ((await UserTable.count({username})) === 0) {
    return new FailServerResponse('用户不存在，修改失败');
  }
  await UserTable.update(user);
  return new SuccessfulServerResponse(undefined);
}
