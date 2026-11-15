import assert from 'node:assert';
import crypto from 'node:crypto';

import {PromiseTask} from '@library/task-runner';
import {assertIsTest} from '@library/test-helpers';
import {UserTable} from '@module/database';
import type {LoginCredentials} from '@schema/auth';

/**
 * Check if `credentials` matches the Account record in database.
 */
export class CheckUserTask extends PromiseTask<boolean> {
  private readonly credentials: LoginCredentials;

  constructor(credentials: LoginCredentials) {
    super();
    this.credentials = credentials;
  }

  public override async run(): Promise<boolean> {
    const {username, password} = this.credentials;
    const expectedAccount = await UserTable.selectByUsername(username);
    if (!expectedAccount) {
      return false;
    }
    const {password: expectedPassword} = expectedAccount;
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
