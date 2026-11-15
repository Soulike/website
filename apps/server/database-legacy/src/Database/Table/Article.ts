import {
  type ArticleInsertRow,
  type ArticleRow,
  ArticleRowSchema,
  type ArticleUpdateRow,
} from '@schema/database';

import {
  generateParameterizedStatementAndParametersArray,
  transaction,
} from '../Function.js';
import pool from '../Pool.js';

export async function insert(article: ArticleInsertRow): Promise<void> {
  const insertStatement = `INSERT INTO "articles"
                             (title, content, category, "publicationTime", "modificationTime", "pageViews", "isVisible")
                             VALUES
                                 ($1, $2, $3, $4, $5, $6, $7)`;
  const client = await pool.connect();
  try {
    const {
      title,
      content,
      category,
      publicationTime,
      modificationTime,
      pageViews,
      isVisible,
    } = article;
    await transaction(client, async (client) => {
      await client.query<unknown[]>(insertStatement, [
        title,
        content,
        category,
        publicationTime,
        modificationTime,
        pageViews,
        isVisible,
      ]);
    });
  } finally {
    client.release();
  }
}

export async function deleteById(id: ArticleRow['id']): Promise<void> {
  const deleteStatement = 'DELETE FROM "articles" WHERE "id"=$1';
  const client = await pool.connect();
  try {
    await transaction(client, async (client) => {
      await client.query(deleteStatement, [id]);
    });
  } finally {
    client.release();
  }
}

export async function update(
  article: ArticleUpdateRow & Pick<ArticleRow, 'id'>,
): Promise<void> {
  const client = await pool.connect();
  try {
    const {id, ...updates} = article;
    const {parameterizedStatement, parameters} =
      generateParameterizedStatementAndParametersArray(updates, ',');
    await transaction(client, async (client) => {
      await client.query(
        `UPDATE "articles" SET ${parameterizedStatement} WHERE "id"=$${
          parameters.length + 1
        }`,
        [...parameters, id],
      );
    });
  } finally {
    client.release();
  }
}

export async function selectById(
  id: ArticleRow['id'],
): Promise<ArticleRow | null> {
  const selectStatement = 'SELECT * FROM "articles" WHERE "id"=$1';
  const {rows, rowCount} = await pool.query(selectStatement, [id]);
  if (rowCount === 0) {
    return null;
  }
  return ArticleRowSchema.parse(rows[0]);
}

export async function countByTitle(
  title: ArticleRow['title'],
): Promise<number> {
  const selectStatement =
    'SELECT count("id") AS "c" FROM "articles" WHERE "title"=$1';
  const {rows} = await pool.query(selectStatement, [title]);
  return Number.parseInt(rows[0].c);
}

export async function selectAllByPublicationTimeDescOrder(): Promise<
  ArticleRow[]
> {
  const {rows} = await pool.query(`SELECT *
                                     FROM "articles"
                                     ORDER BY "publicationTime" DESC, "id" DESC `);
  return rows.map((row) => ArticleRowSchema.parse(row));
}

export async function selectByPublicationTimeDescOrder(
  year: number,
  month?: number,
  day?: number,
): Promise<ArticleRow[]> {
  let queryResult;
  if (typeof month === 'number') {
    if (typeof day === 'number') {
      // 年月日都有
      queryResult = await pool.query(
        `SELECT *
                     FROM "articles" AS "a"
                     WHERE extract(YEAR FROM a."publicationTime") = $1
                       AND extract(MONTH FROM a."publicationTime") = $2
                       AND extract(DAY FROM a."publicationTime") = $3
                     ORDER BY a."publicationTime" DESC, a.id DESC`,
        [year, month, day],
      );
    } // 仅有年月
    else {
      queryResult = await pool.query(
        `SELECT *
                     FROM "articles" AS "a"
                     WHERE extract(YEAR FROM a."publicationTime") = $1
                       AND extract(MONTH FROM a."publicationTime") = $2
                     ORDER BY a."publicationTime" DESC, a.id DESC`,
        [year, month],
      );
    }
  } // 只有年
  else {
    queryResult = await pool.query(
      `SELECT *
                 FROM "articles" AS "a"
                 WHERE extract(YEAR FROM a."publicationTime") = $1
                 ORDER BY a."publicationTime" DESC, a.id DESC`,
      [year],
    );
  }
  const {rows} = queryResult;
  return rows.map((row) => ArticleRowSchema.parse(row));
}

export async function countAll(): Promise<number> {
  const {rows} = await pool.query(`SELECT count("id") AS "c"
                                     FROM "articles"`);
  return Number.parseInt(rows[0].c);
}

export async function selectInPublicationTimeDescOrder(
  article: Partial<ArticleRow>,
): Promise<ArticleRow[]> {
  const {parameterizedStatement, parameters} =
    generateParameterizedStatementAndParametersArray(article, 'AND');
  const {rows} = await pool.query(
    `SELECT * FROM "articles" WHERE ${parameterizedStatement} ORDER BY "publicationTime" DESC, "id" DESC `,
    parameters,
  );
  return rows.map((row) => ArticleRowSchema.parse(row));
}

export async function count(article: Partial<ArticleRow>): Promise<number> {
  const {parameterizedStatement, parameters} =
    generateParameterizedStatementAndParametersArray(article, 'AND');
  const {rows} = await pool.query(
    `SELECT count("id") AS "c" FROM "articles" WHERE ${parameterizedStatement}`,
    parameters,
  );
  return Number.parseInt(rows[0].c);
}
