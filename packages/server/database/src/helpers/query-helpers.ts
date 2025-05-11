import {type Client, type PoolClient} from 'pg';

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
