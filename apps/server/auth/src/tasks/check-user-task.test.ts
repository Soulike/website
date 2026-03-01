import {User} from '@module/classes';
import {FakeUserTable} from '@module/database/fake';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {CheckUserTask} from './check-user-task.js';

vi.mock('@module/database', () => {
  return {
    UserTable: FakeUserTable,
  };
});

describe('CheckUserTask', () => {
  beforeEach(() => {
    FakeUserTable.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true when user credentials match', async () => {
    const username = 'testuser';
    const password = 'password123';
    const saltedPassword = CheckUserTask.getSaltedPasswordForTesting(
      username,
      password,
    );
    await FakeUserTable.insert(new User(username, saltedPassword));

    const task = new CheckUserTask(new User(username, password));
    const result = await task.run();
    expect(result).toBe(true);
  });

  it('should return false when password does not match', async () => {
    const username = 'testuser';
    const saltedPassword = CheckUserTask.getSaltedPasswordForTesting(
      username,
      'password123',
    );
    await FakeUserTable.insert(new User(username, saltedPassword));

    const task = new CheckUserTask(new User(username, 'wrongpassword'));
    const result = await task.run();
    expect(result).toBe(false);
  });

  it('should return false when username does not exist', async () => {
    const saltedPassword = CheckUserTask.getSaltedPasswordForTesting(
      'existinguser',
      'password123',
    );
    await FakeUserTable.insert(new User('existinguser', saltedPassword));

    const task = new CheckUserTask(new User('nonexistentuser', 'password123'));
    const result = await task.run();
    expect(result).toBe(false);
  });
});
