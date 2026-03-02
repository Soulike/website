import fs from 'node:fs';
import {env} from 'node:process';

import {Redis} from 'ioredis';

if (!env.REDIS_PASSWORD_FILE) {
  throw new Error('Env REDIS_PASSWORD_FILE is not provided.');
}

const password = fs.readFileSync(env.REDIS_PASSWORD_FILE, {encoding: 'utf-8'});

export const ioredis = new Redis({
  host: 'redis',
  password,
});
