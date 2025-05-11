import {User} from '@website/classes';

import {query} from '@/helpers/query-helpers.js';
import {generateSqlParameters} from '@/helpers/sql-helpers.js';

export class UserTable {
  static async insert(user: User): Promise<void> {
    const insertStatement =
      'INSERT INTO "users"("username", "password") VALUES ($1,$2)';
    const {username, password} = user;
    await query<unknown[]>(insertStatement, [username, password]);
  }

  static async deleteByUsername(username: User['username']): Promise<void> {
    const deleteStatement = 'DELETE FROM "users" WHERE "username"=$1';
    await query(deleteStatement, [username]);
  }

  static async update(
    user: Partial<User> & Pick<User, 'username'>,
  ): Promise<void> {
    const {parameterizedStatement, parameters} = generateSqlParameters(
      user,
      ',',
    );
    await query(
      `UPDATE "users"
     SET ${parameterizedStatement}
     WHERE "username" = $${(parameters.length + 1).toString()}`,
      [...parameters, user.username],
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

  static async count(user: Partial<User>): Promise<number> {
    const {parameterizedStatement, parameters} = generateSqlParameters(
      user,
      'AND',
    );
    const {rows} = await query<{c: string}>(
      `SELECT count("username") AS "c"
     FROM "users"
     WHERE ${parameterizedStatement}`,
      parameters,
    );
    return Number.parseInt(rows[0].c);
  }
}
