// Import types to apply koa-body module augmentation
import './types.js';

import {requestLogger} from '@library/koa-middlewares';
import Koa from 'koa';
import auth from 'koa-basic-auth';
import {koaBody} from 'koa-body';
import signale from 'signale';

import {BODY, SERVER} from './CONFIG/index.js';
import dispatcher from './Dispatcher/index.js';
const app = new Koa();

app.on('error', (e: unknown) => {
  if (e instanceof Error)
    signale.error(`未捕获的错误：\n${e.name}\n${e.message}\n${e.stack ?? ''}`);
  else signale.error(`未捕获的错误：\n${JSON.stringify(e)}`);
});

app.use(auth({name: SERVER.USERNAME, pass: SERVER.PASSWORD}));
app.use(koaBody(BODY));
app.use(requestLogger(signale.info));
app.use(dispatcher());
app.listen(SERVER.PORT, () => {
  signale.info(`服务器运行在端口 ${SERVER.PORT} (PID: ${process.pid})`);
});
