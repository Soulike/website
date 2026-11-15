import {isObjectEmpty} from '@library/object-helpers';
import {
  type CategoryInsertRow,
  CategoryInsertRowSchema,
  type CategoryRow,
  CategoryRowSchema,
  type CategoryUpdateRow,
  type OrderConfig,
} from '@schema/database';

import {query} from '../helpers/query-helpers.js';
import {
  generateInsertStatement,
  generateOrderByClause,
  generateSetClause,
  generateWhereClause,
} from '../helpers/sql-helpers.js';

export class CategoryTable {
  static async insert(category: CategoryInsertRow): Promise<void> {
    const filteredCategory = CategoryInsertRowSchema.parse(category);
    const {insertStatement, values} = generateInsertStatement(
      'categories',
      filteredCategory,
    );
    await query<unknown[]>(insertStatement, values);
  }

  static async deleteById(id: CategoryRow['id']): Promise<void> {
    const deleteStatement = 'DELETE FROM "categories" WHERE "id"=$1';
    await query(deleteStatement, [id]);
  }

  static async updateById(
    id: CategoryRow['id'],
    category: CategoryUpdateRow,
  ): Promise<void> {
    const {setClause, values} = generateSetClause(category);
    if (values.length == 0) {
      return;
    }
    await query(
      `UPDATE "categories"
       ${setClause}
       WHERE "id" = $${(values.length + 1).toString()}`,
      [...values, id],
    );
  }

  static async selectById(id: CategoryRow['id']): Promise<CategoryRow | null> {
    const selectStatement = 'SELECT * FROM "categories" WHERE "id"=$1';
    const {rows, rowCount} = await query<CategoryRow>(selectStatement, [id]);
    if (rowCount === 0) {
      return null;
    }
    return CategoryRowSchema.parse(rows[0]);
  }

  static async countAll(): Promise<number> {
    return this.count({});
  }

  static async count(category: Partial<CategoryRow>): Promise<number> {
    const {whereClause, values} = generateWhereClause(category);
    const {rows} = await query<{c: string}>(
      `SELECT count("id") AS "c"
       FROM "categories"
       ${whereClause}`,
      values,
    );
    return Number.parseInt(rows[0].c);
  }

  static async selectAll(
    orderConfig: OrderConfig<CategoryRow> = {},
  ): Promise<CategoryRow[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    category: Partial<CategoryRow>,
    orderConfig: OrderConfig<CategoryRow> = {},
  ): Promise<CategoryRow[]> {
    if (isObjectEmpty(category)) {
      return this.selectAll(orderConfig);
    }
    const {whereClause, values} = generateWhereClause(category);
    const {rows} = await query<CategoryRow>(
      `SELECT *
       FROM "categories"
       ${whereClause} ${generateOrderByClause(orderConfig)}`,
      values,
    );
    return rows.map((row) => CategoryRowSchema.parse(row));
  }

  static async countArticlesById(id: CategoryRow['id']): Promise<number> {
    const {rows} = await query<{count: string}>(
      `SELECT count("a"."id") AS "count"
       FROM "categories" "c"
              JOIN "articles" "a" ON "c"."id" = "a"."category"
       WHERE "c"."id" = $1`,
      [id],
    );
    return Number.parseInt(rows[0].count);
  }
}
