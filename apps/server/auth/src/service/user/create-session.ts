import assert from 'node:assert';

import {concurrentPromiseTaskRunner} from '@library/task-runner';
import {Session, User} from '@module/classes';

import {CheckUserTask} from '@/tasks/check-user-task.js';

export async function createSession(user: User): Promise<Session | null> {
  const {result, error} = await concurrentPromiseTaskRunner.push(
    new CheckUserTask(user),
  );
  if (error) {
    throw error;
  }
  assert(result !== null);
  if (result) {
    return new Session(user.username);
  }
  return null;
}
