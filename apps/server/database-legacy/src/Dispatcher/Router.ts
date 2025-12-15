import Router from '@koa/router';

import articleDispatcher from './Article/index.js';
import categoryDispatcher from './Category/index.js';
import userDispatcher from './User/index.js';

const router = new Router();

// 在此注入 router 到各个 dispatcher
userDispatcher(router);
articleDispatcher(router);
categoryDispatcher(router);

export default router;
