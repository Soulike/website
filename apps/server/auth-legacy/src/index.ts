import {requestLogger} from '@library/koa-middlewares';
import Koa from 'koa';
import {koaBody} from 'koa-body';
import session from 'koa-session';
import signale from 'signale';

import {BODY, SERVER, SESSION} from './CONFIG/index.js';
import dispatcher from './Dispatcher/index.js';

const app = new Koa();

app.on('error', (e: unknown) => {
  if (e instanceof Error)
    signale.error(`未捕获的错误：\n${e.name}\n${e.message}\n${e.stack ?? ''}`);
  else signale.error(`未捕获的错误：\n${JSON.stringify(e)}`);
});

app.use(session(SESSION, app));
app.use(koaBody(BODY));
app.use(requestLogger(signale.info));
app.use(dispatcher());
app.listen(SERVER.PORT, () => {
  signale.info(`服务器运行在端口 ${SERVER.PORT} (PID: ${process.pid})`);
});
