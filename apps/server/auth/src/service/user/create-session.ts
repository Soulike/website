import assert from 'node:assert';

import {microTaskRunner} from '@universal/task-runner';
import {User} from '@website/classes';

import {Context} from '@/dispatcher/types.js';
import {CheckUserTask} from '@/tasks/check-user-task.js';

export async function createSession(user: User, ctx: Context) {
  const {result, error} = await microTaskRunner.push(new CheckUserTask(user));
  if (error) {
    throw error;
  }
  assert(result !== null);
  if (result) {
    ctx.session = {};
    ctx.session.username = user.username;
  }
  return result;
}
