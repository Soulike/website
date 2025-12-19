import Router from '@koa/router';

import userDispatcher from './User/index.js';

const router = new Router();

// 在此注入 router 到各个 dispatcher
userDispatcher(router);

export default router;
