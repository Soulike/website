import {isObjectEmpty} from '@library/object-helpers';
import {User} from '@module/classes';

import {OrderConfig} from '../types.js';
import {sortEntities} from './fake-table-helpers.js';

export class FakeUserTable {
  private static users: User[] = [];

  static reset(): void {
    this.users = [];
  }

  static async insert(user: User): Promise<void> {
    const newUser = User.from(user);
    await Promise.resolve();
    this.users.push(newUser);
  }

  static async deleteByUsername(username: User['username']): Promise<void> {
    await Promise.resolve();
    this.users = this.users.filter((user) => user.username !== username);
  }

  static async updateByUsername(
    username: User['username'],
    user: Partial<Omit<User, 'username'>>,
  ): Promise<void> {
    if (isObjectEmpty(user)) {
      return;
    }

    const index = this.users.findIndex((u) => u.username === username);
    if (index !== -1) {
      await Promise.resolve();
      Object.assign(this.users[index], user);
    }
  }

  static async selectByUsername(
    username: User['username'],
  ): Promise<User | null> {
    const user = this.users.find((user) => user.username === username);
    await Promise.resolve();
    return user ? User.from(user) : null;
  }

  static async selectAll(orderConfig: OrderConfig<User> = {}): Promise<User[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    user: Partial<User>,
    orderConfig: OrderConfig<User> = {},
  ): Promise<User[]> {
    if (isObjectEmpty(user)) {
      return this.sortUsers([...this.users], orderConfig);
    }

    const filteredUsers = this.users.filter((u) => {
      return Object.entries(user).every(([key, value]) => {
        return u[key as keyof User] === value;
      });
    });

    await Promise.resolve();
    return this.sortUsers(filteredUsers, orderConfig);
  }

  static async countAll(): Promise<number> {
    await Promise.resolve();
    return this.users.length;
  }

  static async count(user: Partial<User>): Promise<number> {
    if (isObjectEmpty(user)) {
      return this.countAll();
    }

    const filteredUsers = this.users.filter((u) => {
      return Object.entries(user).every(([key, value]) => {
        return u[key as keyof User] === value;
      });
    });

    return filteredUsers.length;
  }

  private static sortUsers(
    users: User[],
    orderConfig: OrderConfig<User>,
  ): User[] {
    const sortedUsers = sortEntities(users, orderConfig);
    return sortedUsers.map((user) => User.from(user));
  }
}
