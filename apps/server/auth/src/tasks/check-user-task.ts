import assert from 'node:assert';
import crypto from 'node:crypto';

import {PromiseTask} from '@library/task-runner';
import {assertIsTest} from '@library/test-helpers';
import {User} from '@module/classes';
import {UserTable} from '@module/database';

/**
 * Check if `user` matches the record in database.
 */
export class CheckUserTask extends PromiseTask<boolean> {
  private readonly user: User;

  constructor(user: User) {
    super();
    this.user = user;
  }

  public override async run(): Promise<boolean> {
    const {username, password} = this.user;
    const expectedUser = await UserTable.selectByUsername(username);
    if (!expectedUser) {
      return false;
    }
    const {password: expectedPassword} = expectedUser;
    const saltedPassword = CheckUserTask.getSaltedPassword(username, password);
    return CheckUserTask.timingSafeEqualHex(saltedPassword, expectedPassword);
  }

  private static getSaltedPassword(username: string, password: string): string {
    return crypto
      .createHash('sha512')
      .update(username + password, 'utf8')
      .digest('hex');
  }

  private static timingSafeEqualHex(a: string, b: string): boolean {
    if (a.length !== b.length || a.length % 2 !== 0) {
      return false;
    }

    const aBuffer = Buffer.from(a, 'hex');
    const bBuffer = Buffer.from(b, 'hex');

    assert(
      aBuffer.length === a.length / 2 && bBuffer.length === b.length / 2,
      'Invalid hex string in password comparison',
    );

    return crypto.timingSafeEqual(aBuffer, bBuffer);
  }

  static getSaltedPasswordForTesting(
    username: string,
    password: string,
  ): string {
    assertIsTest('getSaltedPasswordForTesting');
    return CheckUserTask.getSaltedPassword(username, password);
  }
}
