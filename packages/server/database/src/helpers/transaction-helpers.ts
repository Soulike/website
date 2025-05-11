import {type Client, type PoolClient} from 'pg';

import {pool} from '@/pool/index.js';

export async function transaction(
  queries: (client: Client | PoolClient) => Promise<unknown>,
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('START TRANSACTION');
    await queries(client);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
