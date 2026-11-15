import {
  type AccountInsertRow,
  type AccountRow,
  type AccountUpdateRow,
} from '@schema/database';
import {failResponse, type ServerResponse, successResponse} from '@schema/rpc';

import {User as UserTable} from '../Database/index.js';

export async function add(user: AccountInsertRow): Promise<ServerResponse> {
  const {username} = user;
  if ((await UserTable.count({username})) !== 0) {
    return failResponse({code: 'ACCOUNT_ALREADY_EXISTS'});
  }
  await UserTable.insert(user);
  return successResponse();
}

export async function get(
  username: AccountRow['username'],
): Promise<ServerResponse<AccountRow>> {
  const user = await UserTable.selectByUsername(username);
  if (user === null) {
    return failResponse({code: 'ACCOUNT_NOT_FOUND'});
  }
  return successResponse(user);
}

export async function modify(
  user: AccountUpdateRow & Pick<AccountRow, 'username'>,
): Promise<ServerResponse> {
  const {username} = user;
  if ((await UserTable.count({username})) === 0) {
    return failResponse({code: 'ACCOUNT_NOT_FOUND'});
  }
  await UserTable.update(user);
  return successResponse();
}
