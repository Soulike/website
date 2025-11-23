import {isObjectEmpty} from '@library/object-helpers';
import {Article} from '@module/classes';

import {query} from '@/helpers/query-helpers.js';
import {
  generateInsertStatement,
  generateOrderByClause,
  generateSetClause,
  generateWhereClause,
} from '@/helpers/sql-helpers.js';
import {OrderConfig} from '@/types.js';

export class ArticleTable {
  static async insert(article: Omit<Article, 'id'>): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...filteredArticle} = Article.from({id: 0, ...article});
    const {insertStatement, values} = generateInsertStatement(
      'articles',
      filteredArticle,
    );
    await query<unknown[]>(insertStatement, values);
  }

  static async deleteById(id: Article['id']): Promise<void> {
    const deleteStatement = 'DELETE FROM "articles" WHERE "id"=$1';
    await query(deleteStatement, [id]);
  }

  static async updateById(
    id: Article['id'],
    article: Partial<Omit<Article, 'id'>>,
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

  static async selectById(id: Article['id']): Promise<Article | null> {
    const selectStatement = 'SELECT * FROM "articles" WHERE "id"=$1';
    const {rows, rowCount} = await query<Article>(selectStatement, [id]);
    if (rowCount === 0) {
      return null;
    } else {
      return Article.from(rows[0]);
    }
  }

  static async selectAll(
    orderConfig: OrderConfig<Article> = {},
  ): Promise<Article[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    article: Partial<Article>,
    orderConfig: OrderConfig<Article> = {},
  ): Promise<Article[]> {
    if (isObjectEmpty(article)) {
      return this.selectAll(orderConfig);
    }
    const {whereClause, values} = generateWhereClause(article);
    const {rows} = await query<Article>(
      `SELECT *
       FROM "articles" ${whereClause} ${generateOrderByClause(orderConfig)}`,
      values,
    );
    return rows.map((row) => Article.from(row));
  }

  static async countAll(): Promise<number> {
    const {rows} = await query<{c: string}>(`SELECT count("id") AS "c"
                                             FROM "articles"`);
    return Number.parseInt(rows[0].c);
  }

  static async count(article: Partial<Article>): Promise<number> {
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
    return Number.parseInt(rows[0].c);
  }
}
