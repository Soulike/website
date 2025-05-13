import {User} from '@website/classes';
import {isObjectEmpty} from '@website/object-helpers';

import {query} from '@/helpers/query-helpers.js';
import {
  generateInsertStatement,
  generateOrderByClause,
  generateSetClause,
  generateWhereClause,
} from '@/helpers/sql-helpers.js';
import {OrderConfig} from '@/types.js';

export class UserTable {
  static async insert(user: User): Promise<void> {
    const filteredUser = Object.assign<Record<string, unknown>, User>(
      {},
      User.from(user),
    );
    const {insertStatement, values} = generateInsertStatement(
      'users',
      filteredUser,
    );
    await query<unknown[]>(insertStatement, values);
  }

  static async deleteByUsername(username: User['username']): Promise<void> {
    const deleteStatement = 'DELETE FROM "users" WHERE "username"=$1';
    await query(deleteStatement, [username]);
  }

  static async updateByUsername(
    username: User['username'],
    user: Partial<Omit<User, 'username'>>,
  ): Promise<void> {
    const {setClause, values} = generateSetClause(user);
    if (values.length == 0) {
      return;
    }
    await query(
      `UPDATE "users"
       ${setClause}
       WHERE "username" = $${(values.length + 1).toString()}`,
      [...values, username],
    );
  }

  static async selectByUsername(
    username: User['username'],
  ): Promise<User | null> {
    const selectStatement = 'SELECT * FROM "users" WHERE "username"=$1';
    const {rows, rowCount} = await query<User>(selectStatement, [username]);
    if (rowCount === 0) {
      return null;
    } else {
      return User.from(rows[0]);
    }
  }

  static async selectAll(orderConfig: OrderConfig<User> = {}): Promise<User[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    user: Partial<User>,
    orderConfig: OrderConfig<User> = {},
  ): Promise<User[]> {
    if (isObjectEmpty(user)) {
      return this.selectAll(orderConfig);
    }
    const {whereClause, values} = generateWhereClause(user);
    const {rows} = await query<User>(
      `SELECT *
       FROM "users" ${whereClause} ${generateOrderByClause(orderConfig)}`,
      values,
    );
    return rows.map((row) => User.from(row));
  }

  static async countAll(): Promise<number> {
    return this.count({});
  }

  static async count(user: Partial<User>): Promise<number> {
    if (isObjectEmpty(user)) {
      return this.countAll();
    }
    const {whereClause, values} = generateWhereClause(user);
    const {rows} = await query<{c: string}>(
      `SELECT count("username") AS "c"
       FROM "users" ${whereClause}`,
      values,
    );
    return Number.parseInt(rows[0].c);
  }
}
