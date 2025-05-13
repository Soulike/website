import {
  type Client,
  type PoolClient,
  type QueryResult,
  type QueryResultRow,
} from 'pg';

import {pool} from '@/pool/index.js';

export async function transaction<ReturnType>(
  queries: (client: Client | PoolClient) => Promise<ReturnType>,
): Promise<ReturnType> {
  const client = await pool.connect();
  try {
    await client.query('START TRANSACTION');
    const result = await queries(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function query<R extends QueryResultRow>(
  queryText: string,
  values?: unknown[],
): Promise<QueryResult<R>> {
  return pool.query<R>(queryText, values);
}
