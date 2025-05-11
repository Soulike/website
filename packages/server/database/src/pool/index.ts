import {Pool} from 'pg';

import {POOL_CONFIG} from './config.js';

const pool = new Pool(POOL_CONFIG);

try {
  const client = await pool.connect();
  await client.query('SELECT 1=1');
} catch (e: unknown) {
  console.error(`Database connection failed.`);
  throw e;
}

export {pool};
