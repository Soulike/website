import crypto from 'node:crypto';

import {bodyParser} from '@koa/bodyparser';
import {Logger} from '@server/logger';
import Koa from 'koa';
import session from 'koa-session';

import {KOA_BODY_OPTIONS} from '@/configurations/koa-body-options.js';
import {KOS_SESSION_OPTIONS} from '@/configurations/koa-session-options.js';
import {LISTEN_OPTIONS} from '@/configurations/listen-options.js';
import {dispatcher} from '@/dispatcher/index.js';

const app = new Koa();

app.on('error', (e: unknown) => {
  if (e instanceof Error) {
    Logger.error(`Uncaught error：\n${e.name}\n${e.message}\n${e.stack ?? ''}`);
  } else {
    Logger.error(`Uncaught error：\n${JSON.stringify(e)}`);
  }
});

const secret = crypto.randomBytes(128).toString('hex');
app.keys = [secret];

app.use(session(KOS_SESSION_OPTIONS, app));
app.use(bodyParser(KOA_BODY_OPTIONS));
app.use(dispatcher());

app.listen(LISTEN_OPTIONS, () => {
  Logger.success(
    `Server is listening on port ${LISTEN_OPTIONS.port.toString()}`,
  );
});
