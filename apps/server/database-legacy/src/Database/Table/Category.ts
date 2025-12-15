import {Category} from '@module/classes';

import {
  generateParameterizedStatementAndParametersArray,
  transaction,
} from '../Function.js';
import pool from '../Pool.js';

export async function insert(category: Omit<Category, 'id'>): Promise<void> {
  const insertStatement = 'INSERT INTO "categories"("name") VALUES ($1)';
  const client = await pool.connect();
  try {
    const {name} = category;
    await transaction(client, async (client) => {
      await client.query(insertStatement, [name]);
    });
  } finally {
    client.release();
  }
}

export async function deleteById(id: Category['id']): Promise<void> {
  const deleteStatement = 'DELETE FROM "categories" WHERE "id"=$1';
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
  category: Partial<Category> & Pick<Category, 'id'>,
): Promise<void> {
  const client = await pool.connect();
  try {
    const {parameterizedStatement, parameters} =
      generateParameterizedStatementAndParametersArray(category, ',');
    await transaction(client, async (client) => {
      await client.query(
        `UPDATE "categories" SET ${parameterizedStatement} WHERE "id"=$${
          parameters.length + 1
        }`,
        [...parameters, category.id],
      );
    });
  } finally {
    client.release();
  }
}

export async function selectById(id: Category['id']): Promise<Category | null> {
  const selectStatement = 'SELECT * FROM "categories" WHERE "id"=$1';
  const {rows, rowCount} = await pool.query(selectStatement, [id]);
  if (rowCount === 0) {
    return null;
  } else {
    return Category.from(rows[0]);
  }
}

export async function count(category: Partial<Category>): Promise<number> {
  const {parameterizedStatement, parameters} =
    generateParameterizedStatementAndParametersArray(category, 'AND');
  const {rows} = await pool.query(
    `SELECT count("id") AS "c" FROM "categories" WHERE ${parameterizedStatement}`,
    parameters,
  );
  return Number.parseInt(rows[0].c);
}

export async function selectAll(): Promise<Category[]> {
  const {rows} = await pool.query(`SELECT *
                                     FROM "categories"`);
  return rows.map((row) => Category.from(row));
}

export async function select(category: Partial<Category>): Promise<Category[]> {
  const {parameterizedStatement, parameters} =
    generateParameterizedStatementAndParametersArray(category, 'AND');
  const {rows} = await pool.query(
    `SELECT * FROM "categories" WHERE ${parameterizedStatement}`,
    parameters,
  );
  return rows.map((row) => Category.from(row));
}

export async function countArticlesById(id: Category['id']): Promise<number> {
  const {rows} = await pool.query(
    `SELECT count("a"."id") AS "count"
             FROM "categories"        "c"
                      JOIN "articles" "a" ON "c"."id" = "a"."category"
             WHERE "c"."id" = $1`,
    [id],
  );
  return Number.parseInt(rows[0].count);
}
