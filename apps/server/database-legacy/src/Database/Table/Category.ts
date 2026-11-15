import {
  type CategoryInsertRow,
  type CategoryRow,
  CategoryRowSchema,
  type CategoryUpdateRow,
} from '@schema/database';

import {
  generateParameterizedStatementAndParametersArray,
  transaction,
} from '../Function.js';
import pool from '../Pool.js';

export async function insert(category: CategoryInsertRow): Promise<void> {
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

export async function deleteById(id: CategoryRow['id']): Promise<void> {
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
  category: CategoryUpdateRow & Pick<CategoryRow, 'id'>,
): Promise<void> {
  const client = await pool.connect();
  try {
    const {id, ...updates} = category;
    const {parameterizedStatement, parameters} =
      generateParameterizedStatementAndParametersArray(updates, ',');
    await transaction(client, async (client) => {
      await client.query(
        `UPDATE "categories" SET ${parameterizedStatement} WHERE "id"=$${
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
  id: CategoryRow['id'],
): Promise<CategoryRow | null> {
  const selectStatement = 'SELECT * FROM "categories" WHERE "id"=$1';
  const {rows, rowCount} = await pool.query(selectStatement, [id]);
  if (rowCount === 0) {
    return null;
  }
  return CategoryRowSchema.parse(rows[0]);
}

export async function count(category: Partial<CategoryRow>): Promise<number> {
  const {parameterizedStatement, parameters} =
    generateParameterizedStatementAndParametersArray(category, 'AND');
  const {rows} = await pool.query(
    `SELECT count("id") AS "c" FROM "categories" WHERE ${parameterizedStatement}`,
    parameters,
  );
  return Number.parseInt(rows[0].c);
}

export async function selectAll(): Promise<CategoryRow[]> {
  const {rows} = await pool.query(`SELECT *
                                     FROM "categories"`);
  return rows.map((row) => CategoryRowSchema.parse(row));
}

export async function select(
  category: Partial<CategoryRow>,
): Promise<CategoryRow[]> {
  const {parameterizedStatement, parameters} =
    generateParameterizedStatementAndParametersArray(category, 'AND');
  const {rows} = await pool.query(
    `SELECT * FROM "categories" WHERE ${parameterizedStatement}`,
    parameters,
  );
  return rows.map((row) => CategoryRowSchema.parse(row));
}

export async function countArticlesById(
  id: CategoryRow['id'],
): Promise<number> {
  const {rows} = await pool.query(
    `SELECT count("a"."id") AS "count"
             FROM "categories"        "c"
                      JOIN "articles" "a" ON "c"."id" = "a"."category"
             WHERE "c"."id" = $1`,
    [id],
  );
  return Number.parseInt(rows[0].count);
}
