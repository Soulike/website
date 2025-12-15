import fs from 'node:fs';
import {env} from 'node:process';

import {type PoolConfig} from 'pg';

if (!env.DB_PASSWORD_FILE) {
  throw new Error('Env DB_PASSWORD_FILE is not provided.');
}

const DB_PASSWORD = fs.readFileSync(env.DB_PASSWORD_FILE, {encoding: 'utf-8'});

export const DATABASE: PoolConfig = {
  host: 'db',
  port: 5432,
  user: 'soulike',
  database: 'website',
  password: DB_PASSWORD,
  keepAlive: true,
  max: 64,
};
