import {isObjectEmpty} from '@library/object-helpers';
import {Category} from '@module/classes';

import {query} from '@/helpers/query-helpers.js';
import {
  generateInsertStatement,
  generateOrderByClause,
  generateSetClause,
  generateWhereClause,
} from '@/helpers/sql-helpers.js';
import {OrderConfig} from '@/types.js';

export class CategoryTable {
  static async insert(category: Omit<Category, 'id'>): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...filteredCategory} = Category.from({id: 0, ...category});
    const {insertStatement, values} = generateInsertStatement(
      'categories',
      filteredCategory,
    );
    await query<unknown[]>(insertStatement, values);
  }

  static async deleteById(id: Category['id']): Promise<void> {
    const deleteStatement = 'DELETE FROM "categories" WHERE "id"=$1';
    await query(deleteStatement, [id]);
  }

  static async updateById(
    id: Category['id'],
    category: Partial<Omit<Category, 'id'>>,
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

  static async selectById(id: Category['id']): Promise<Category | null> {
    const selectStatement = 'SELECT * FROM "categories" WHERE "id"=$1';
    const {rows, rowCount} = await query<Category>(selectStatement, [id]);
    if (rowCount === 0) {
      return null;
    } else {
      return Category.from(rows[0]);
    }
  }

  static async countAll(): Promise<number> {
    return this.count({});
  }

  static async count(category: Partial<Category>): Promise<number> {
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
    orderConfig: OrderConfig<Category> = {},
  ): Promise<Category[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    category: Partial<Category>,
    orderConfig: OrderConfig<Category> = {},
  ): Promise<Category[]> {
    if (isObjectEmpty(category)) {
      return this.selectAll(orderConfig);
    }
    const {whereClause, values} = generateWhereClause(category);
    const {rows} = await query<Category>(
      `SELECT *
       FROM "categories"
       ${whereClause} ${generateOrderByClause(orderConfig)}`,
      values,
    );
    return rows.map((row) => Category.from(row));
  }

  static async countArticlesById(id: Category['id']): Promise<number> {
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
