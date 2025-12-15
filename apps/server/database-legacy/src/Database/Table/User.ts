import {User} from '@module/classes';

import {
  generateParameterizedStatementAndParametersArray,
  transaction,
} from '../Function.js';
import pool from '../Pool.js';

export async function insert(user: User): Promise<void> {
  const insertStatement =
    'INSERT INTO "users"("username", "password") VALUES ($1,$2)';
  const client = await pool.connect();
  try {
    const {username, password} = user;
    await transaction(client, async (client) => {
      await client.query(insertStatement, [username, password]);
    });
  } finally {
    client.release();
  }
}

export async function deleteByUsername(
  username: User['username'],
): Promise<void> {
  const deleteStatement = 'DELETE FROM "users" WHERE "username"=$1';
  const client = await pool.connect();
  try {
    await transaction(client, async (client) => {
      await client.query(deleteStatement, [username]);
    });
  } finally {
    client.release();
  }
}

export async function update(
  user: Partial<User> & Pick<User, 'username'>,
): Promise<void> {
  const client = await pool.connect();
  try {
    const {parameterizedStatement, parameters} =
      generateParameterizedStatementAndParametersArray(user, ',');
    await transaction(client, async (client) => {
      await client.query(
        `UPDATE "users" SET ${parameterizedStatement} WHERE "username"=$${
          parameters.length + 1
        }`,
        [...parameters, user.username],
      );
    });
  } finally {
    client.release();
  }
}

export async function selectByUsername(
  username: User['username'],
): Promise<User | null> {
  const selectStatement = 'SELECT * FROM "users" WHERE "username"=$1';
  const {rows, rowCount} = await pool.query(selectStatement, [username]);
  if (rowCount === 0) {
    return null;
  } else {
    return User.from(rows[0]);
  }
}

export async function count(user: Partial<User>): Promise<number> {
  const {parameterizedStatement, parameters} =
    generateParameterizedStatementAndParametersArray(user, 'AND');
  const {rows} = await pool.query(
    `SELECT count("username") AS "c" FROM "users" WHERE ${parameterizedStatement}`,
    parameters,
  );
  return Number.parseInt(rows[0].c);
}
