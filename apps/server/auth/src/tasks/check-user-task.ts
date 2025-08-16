import {UserTable} from '@server/database';
import {PromiseTask} from '@universal/task-runner/dist/tasks/promise-task.js';
import {User} from '@website/classes';

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
    return password === expectedPassword;
  }
}
