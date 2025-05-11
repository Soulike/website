import {Category} from '@website/classes';

import {generateSqlParameters} from '@/helpers/sql-helpers.js';
import {pool} from '@/pool/index.js';

export class CategoryTable {
  static async insert(category: Omit<Category, 'id'>): Promise<void> {
    const insertStatement = 'INSERT INTO "categories"("name") VALUES ($1)';
    const {name} = category;
    await pool.query<unknown[]>(insertStatement, [name]);
  }

  static async deleteById(id: Category['id']): Promise<void> {
    const deleteStatement = 'DELETE FROM "categories" WHERE "id"=$1';
    await pool.query(deleteStatement, [id]);
  }

  static async update(
    category: Partial<Category> & Pick<Category, 'id'>,
  ): Promise<void> {
    const {parameterizedStatement, parameters} = generateSqlParameters(
      category,
      ',',
    );
    await pool.query(
      `UPDATE "categories"
     SET ${parameterizedStatement}
     WHERE "id" = $${(parameters.length + 1).toString()}`,
      [...parameters, category.id],
    );
  }

  static async selectById(id: Category['id']): Promise<Category | null> {
    const selectStatement = 'SELECT * FROM "categories" WHERE "id"=$1';
    const {rows, rowCount} = await pool.query<Category>(selectStatement, [id]);
    if (rowCount === 0) {
      return null;
    } else {
      return Category.from(rows[0]);
    }
  }

  static async count(category: Partial<Category>): Promise<number> {
    const {parameterizedStatement, parameters} = generateSqlParameters(
      category,
      'AND',
    );
    const {rows} = await pool.query<{c: string}>(
      `SELECT count("id") AS "c"
     FROM "categories"
     WHERE ${parameterizedStatement}`,
      parameters,
    );
    return Number.parseInt(rows[0].c);
  }

  static async selectAll(): Promise<Category[]> {
    const {rows} = await pool.query<Category>(`SELECT *
                                             FROM "categories"`);
    return rows.map((row) => Category.from(row));
  }

  static async select(category: Partial<Category>): Promise<Category[]> {
    const {parameterizedStatement, parameters} = generateSqlParameters(
      category,
      'AND',
    );
    const {rows} = await pool.query<Category>(
      `SELECT *
     FROM "categories"
     WHERE ${parameterizedStatement}`,
      parameters,
    );
    return rows.map((row) => Category.from(row));
  }

  static async countArticlesById(id: Category['id']): Promise<number> {
    const {rows} = await pool.query<{count: string}>(
      `SELECT count("a"."id") AS "count"
     FROM "categories" "c"
            JOIN "articles" "a" ON "c"."id" = "a"."category"
     WHERE "c"."id" = $1`,
      [id],
    );
    return Number.parseInt(rows[0].count);
  }
}
