import crypto from 'node:crypto';

import {PromiseTask} from '@library/task-runner';
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
    return saltedPassword === expectedPassword;
  }

  private static getSaltedPassword(username: string, password: string): string {
    return crypto
      .createHash('sha512')
      .update(username + password, 'utf8')
      .digest('hex');
  }

  static getSaltedPasswordForTesting(
    username: string,
    password: string,
  ): string {
    return CheckUserTask.getSaltedPassword(username, password);
  }
}
