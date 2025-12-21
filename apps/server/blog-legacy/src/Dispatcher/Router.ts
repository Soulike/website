import Router from '@koa/router';

import articleDispatcher from './Article/index.js';
import categoryDispatcher from './Category/index.js';
import optionDispatcher from './Option/index.js';

const router = new Router();

// 在此注入 router 到各个 dispatcher
articleDispatcher(router);
categoryDispatcher(router);
optionDispatcher(router);

export default router;
