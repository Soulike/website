import assert from 'node:assert';

import {concurrentPromiseTaskRunner} from '@library/task-runner';
import {type LoginCredentials, type Session, SessionSchema} from '@schema/auth';

import {CheckUserTask} from '@/tasks/check-user-task.js';

export async function createSession(
  credentials: LoginCredentials,
): Promise<Session | null> {
  const {result, error} = await concurrentPromiseTaskRunner.push(
    new CheckUserTask(credentials),
  );
  if (error) {
    throw error;
  }
  assert(result !== null);
  if (!result) {
    return null;
  }
  return SessionSchema.parse({username: credentials.username});
}
