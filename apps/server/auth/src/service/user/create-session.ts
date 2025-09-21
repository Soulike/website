import assert from 'node:assert';

import {concurrentPromiseTaskRunner} from '@universal/task-runner';
import {User, UserInfo} from '@website/classes';

import {Context} from '@/dispatcher/types.js';
import {CheckUserTask} from '@/tasks/check-user-task.js';

export async function createSession(user: User, ctx: Context) {
  const {result, error} = await concurrentPromiseTaskRunner.push(
    new CheckUserTask(user),
  );
  if (error) {
    throw error;
  }
  assert(result !== null);
  if (result) {
    ctx.session = {
      data: new UserInfo(user.username),
    };
  }
  return result;
}
