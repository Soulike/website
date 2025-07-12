import {FakeUserTable} from '@server/database/fake';
import {User} from '@website/classes';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {CheckUserTask} from './check-user-task.js';

vi.mock('@server/database', () => {
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
    const validUser = new User('testuser', 'password123');
    await FakeUserTable.insert(validUser);

    const task = new CheckUserTask(validUser);
    const result = await task.run();
    expect(result).toBe(true);
  });

  it('should return false when password does not match', async () => {
    const storedUser = new User('testuser', 'password123');
    await FakeUserTable.insert(storedUser);

    const invalidUser = new User('testuser', 'wrongpassword');
    const task = new CheckUserTask(invalidUser);

    const result = await task.run();
    expect(result).toBe(false);
  });

  it('should return false when username does not exist', async () => {
    const storedUser = new User('existinguser', 'password123');
    await FakeUserTable.insert(storedUser);

    const nonExistentUser = new User('nonexistentuser', 'password123');
    const task = new CheckUserTask(nonExistentUser);

    const result = await task.run();
    expect(result).toBe(false);
  });
});
