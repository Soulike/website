import assert from 'node:assert';

import {isObjectEmpty} from '@library/object-helpers';
import {
  type ArticleInsertRow,
  ArticleInsertRowSchema,
  type ArticleRow,
  ArticleRowSchema,
  type ArticleUpdateRow,
  type OrderConfig,
} from '@schema/database';

import {query} from '../helpers/query-helpers.js';
import {
  generateInsertStatement,
  generateOrderByClause,
  generateSetClause,
  generateWhereClause,
} from '../helpers/sql-helpers.js';

export class ArticleTable {
  static async insert(article: ArticleInsertRow): Promise<void> {
    const filteredArticle = ArticleInsertRowSchema.parse(article);
    const {insertStatement, values} = generateInsertStatement(
      'articles',
      filteredArticle,
    );
    await query<unknown[]>(insertStatement, values);
  }

  static async deleteById(id: ArticleRow['id']): Promise<void> {
    const deleteStatement = 'DELETE FROM "articles" WHERE "id"=$1';
    await query(deleteStatement, [id]);
  }

  static async updateById(
    id: ArticleRow['id'],
    article: ArticleUpdateRow,
  ): Promise<void> {
    const {setClause, values} = generateSetClause(article);
    if (values.length == 0) {
      return;
    }
    await query(
      `UPDATE "articles"
       ${setClause}
       WHERE "id" = $${(values.length + 1).toString()}`,
      [...values, id],
    );
  }

  static async selectById(id: ArticleRow['id']): Promise<ArticleRow | null> {
    const selectStatement = 'SELECT * FROM "articles" WHERE "id"=$1';
    const {rows, rowCount} = await query<ArticleRow>(selectStatement, [id]);
    if (rowCount === 0) {
      return null;
    }
    return ArticleRowSchema.parse(rows[0]);
  }

  static async selectAll(
    orderConfig: OrderConfig<ArticleRow> = {},
  ): Promise<ArticleRow[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    article: Partial<ArticleRow>,
    orderConfig: OrderConfig<ArticleRow> = {},
  ): Promise<ArticleRow[]> {
    if (isObjectEmpty(article)) {
      return this.selectAll(orderConfig);
    }
    const {whereClause, values} = generateWhereClause(article);
    const {rows} = await query<ArticleRow>(
      `SELECT *
       FROM "articles" ${whereClause} ${generateOrderByClause(orderConfig)}`,
      values,
    );
    return rows.map((row) => ArticleRowSchema.parse(row));
  }

  static async countAll(): Promise<number> {
    const {rows} = await query<{c: string}>(`SELECT count("id") AS "c"
                                             FROM "articles"`);
    const [row] = rows;
    assert(row !== undefined);
    return Number.parseInt(row.c);
  }

  static async count(article: Partial<ArticleRow>): Promise<number> {
    if (isObjectEmpty(article)) {
      return this.countAll();
    }
    const {whereClause, values} = generateWhereClause(article);
    const {rows} = await query<{c: string}>(
      `SELECT count("id") AS "c"
       FROM "articles"
       ${whereClause}`,
      values,
    );
    const [row] = rows;
    assert(row !== undefined);
    return Number.parseInt(row.c);
  }
}
