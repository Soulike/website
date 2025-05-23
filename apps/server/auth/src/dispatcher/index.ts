import compose from 'koa-compose';

import {router as userRouter} from './user/index.js';

export function dispatcher() {
  return compose([userRouter.routes(), userRouter.allowedMethods()]);
}
