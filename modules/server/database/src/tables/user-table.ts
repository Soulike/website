import {isObjectEmpty} from '@library/object-helpers';
import {
  type AccountInsertRow,
  AccountInsertRowSchema,
  type AccountRow,
  AccountRowSchema,
  type AccountUpdateRow,
  type OrderConfig,
} from '@schema/database';

import {query} from '../helpers/query-helpers.js';
import {
  generateInsertStatement,
  generateOrderByClause,
  generateSetClause,
  generateWhereClause,
} from '../helpers/sql-helpers.js';

export class UserTable {
  static async insert(account: AccountInsertRow): Promise<void> {
    const filteredAccount = AccountInsertRowSchema.parse(account);
    const {insertStatement, values} = generateInsertStatement(
      'users',
      filteredAccount,
    );
    await query<unknown[]>(insertStatement, values);
  }

  static async deleteByUsername(
    username: AccountRow['username'],
  ): Promise<void> {
    const deleteStatement = 'DELETE FROM "users" WHERE "username"=$1';
    await query(deleteStatement, [username]);
  }

  static async updateByUsername(
    username: AccountRow['username'],
    account: AccountUpdateRow,
  ): Promise<void> {
    const {setClause, values} = generateSetClause(account);
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
    username: AccountRow['username'],
  ): Promise<AccountRow | null> {
    const selectStatement = 'SELECT * FROM "users" WHERE "username"=$1';
    const {rows, rowCount} = await query<AccountRow>(selectStatement, [
      username,
    ]);
    if (rowCount === 0) {
      return null;
    }
    return AccountRowSchema.parse(rows[0]);
  }

  static async selectAll(
    orderConfig: OrderConfig<AccountRow> = {},
  ): Promise<AccountRow[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    account: Partial<AccountRow>,
    orderConfig: OrderConfig<AccountRow> = {},
  ): Promise<AccountRow[]> {
    if (isObjectEmpty(account)) {
      return this.selectAll(orderConfig);
    }
    const {whereClause, values} = generateWhereClause(account);
    const {rows} = await query<AccountRow>(
      `SELECT *
       FROM "users" ${whereClause} ${generateOrderByClause(orderConfig)}`,
      values,
    );
    return rows.map((row) => AccountRowSchema.parse(row));
  }

  static async countAll(): Promise<number> {
    return this.count({});
  }

  static async count(account: Partial<AccountRow>): Promise<number> {
    if (isObjectEmpty(account)) {
      return this.countAll();
    }
    const {whereClause, values} = generateWhereClause(account);
    const {rows} = await query<{c: string}>(
      `SELECT count("username") AS "c"
       FROM "users" ${whereClause}`,
      values,
    );
    return Number.parseInt(rows[0].c);
  }
}
