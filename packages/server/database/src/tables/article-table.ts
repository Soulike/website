import {Article} from '@website/classes';

import {generateSqlParameters} from '@/helpers/sql-helpers.js';
import {pool} from '@/pool/index.js';

export class ArticleTable {
  static async insert(article: Omit<Article, 'id'>): Promise<void> {
    const insertStatement = `INSERT INTO "articles"
                           (title, content, category, "publicationTime", "modificationTime", "pageViews", "isVisible")
                           VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const {
      title,
      content,
      category,
      publicationTime,
      modificationTime,
      pageViews,
      isVisible,
    } = article;
    await pool.query<unknown[]>(insertStatement, [
      title,
      content,
      category,
      publicationTime,
      modificationTime,
      pageViews,
      isVisible,
    ]);
  }

  static async deleteById(id: Article['id']): Promise<void> {
    const deleteStatement = 'DELETE FROM "articles" WHERE "id"=$1';
    await pool.query(deleteStatement, [id]);
  }

  static async update(
    article: Partial<Article> & Pick<Article, 'id'>,
  ): Promise<void> {
    const {parameterizedStatement, parameters} = generateSqlParameters(
      article,
      ',',
    );
    await pool.query(
      `UPDATE "articles"
     SET ${parameterizedStatement}
     WHERE "id" = $${(parameters.length + 1).toString()}`,
      [...parameters, article.id],
    );
  }

  static async selectById(id: Article['id']): Promise<Article | null> {
    const selectStatement = 'SELECT * FROM "articles" WHERE "id"=$1';
    const {rows, rowCount} = await pool.query<Article>(selectStatement, [id]);
    if (rowCount === 0) {
      return null;
    } else {
      return Article.from(rows[0]);
    }
  }

  static async countByTitle(title: Article['title']): Promise<number> {
    const selectStatement =
      'SELECT count("id") AS "c" FROM "articles" WHERE "title"=$1';
    const {rows} = await pool.query<{c: string}>(selectStatement, [title]);
    return Number.parseInt(rows[0].c);
  }

  static async selectAllByPublicationTimeDescOrder(): Promise<Article[]> {
    const {rows} = await pool.query<Article>(`SELECT *
                                            FROM "articles"
                                            ORDER BY "publicationTime" DESC, "id" DESC `);
    return rows.map((row) => Article.from(row));
  }

  static async selectByPublicationTimeDescOrder(
    year: number,
    month?: number,
    day?: number,
  ): Promise<Article[]> {
    let queryResult = null;
    if (typeof month === 'number') {
      if (typeof day === 'number') {
        queryResult = await pool.query<Article>(
          `SELECT *
         FROM "articles" AS "a"
         WHERE extract(YEAR FROM a."publicationTime") = $1
           AND extract(MONTH FROM a."publicationTime") = $2
           AND extract(DAY FROM a."publicationTime") = $3
         ORDER BY a."publicationTime" DESC, a.id DESC`,
          [year, month, day],
        );
      } else {
        queryResult = await pool.query<Article>(
          `SELECT *
         FROM "articles" AS "a"
         WHERE extract(YEAR FROM a."publicationTime") = $1
           AND extract(MONTH FROM a."publicationTime") = $2
         ORDER BY a."publicationTime" DESC, a.id DESC`,
          [year, month],
        );
      }
    } else {
      queryResult = await pool.query<Article>(
        `SELECT *
       FROM "articles" AS "a"
       WHERE extract(YEAR FROM a."publicationTime") = $1
       ORDER BY a."publicationTime" DESC, a.id DESC`,
        [year],
      );
    }
    const {rows} = queryResult;
    return rows.map((row) => Article.from(row));
  }

  static async countAll(): Promise<number> {
    const {rows} = await pool.query<{c: string}>(`SELECT count("id") AS "c"
                                                FROM "articles"`);
    return Number.parseInt(rows[0].c);
  }

  static async selectInPublicationTimeDescOrder(
    article: Partial<Article>,
  ): Promise<Article[]> {
    const {parameterizedStatement, parameters} = generateSqlParameters(
      article,
      'AND',
    );
    const {rows} = await pool.query<Article>(
      `SELECT *
     FROM "articles"
     WHERE ${parameterizedStatement}
     ORDER BY "publicationTime" DESC, "id" DESC `,
      parameters,
    );
    return rows.map((row) => Article.from(row));
  }

  static async count(article: Partial<Article>): Promise<number> {
    const {parameterizedStatement, parameters} = generateSqlParameters(
      article,
      'AND',
    );
    const {rows} = await pool.query<{c: string}>(
      `SELECT count("id") AS "c"
     FROM "articles"
     WHERE ${parameterizedStatement}`,
      parameters,
    );
    return Number.parseInt(rows[0].c);
  }
}
