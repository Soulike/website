import {errorHandling} from '@library/koa-middlewares';
import compose from 'koa-compose';
import signale from 'signale';

import router from './Router.js';

export default () => {
  return compose([
    errorHandling(signale.error),
    router.routes(),
    router.allowedMethods(),
  ]);
};
