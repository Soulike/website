import Router from '@koa/router';

import blogDispatcher from './Blog/index.js';

const router = new Router();

// 在此注入 router 到各个 dispatcher
blogDispatcher(router);

export default router;
