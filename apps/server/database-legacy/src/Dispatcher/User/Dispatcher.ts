import {jsonQsParser} from '@library/koa-middlewares';
import {
  AccountInsertRowSchema,
  AccountRowSchema,
  AccountUpdateRowSchema,
} from '@schema/database';
import {z} from 'zod';

import {AppRouter} from '@/types.js';

import {User as UserService} from '../../Service/index.js';
import {onJSONQsParseError, parseRequestPayload} from '../Function.js';
import {ADD, GET, MODIFY} from './ROUTE.js';

const AccountUsernamePayloadSchema = z.object({
  username: AccountRowSchema.shape.username,
});

const UpdateAccountPayloadSchema = AccountUpdateRowSchema.extend({
  username: AccountRowSchema.shape.username,
}).refine((value) => value.password !== undefined, {
  message: 'At least one modifiable field is required',
});

export default (router: AppRouter) => {
  router.post(ADD, async (ctx) => {
    const parsed = parseRequestPayload(
      AccountInsertRowSchema,
      ctx.request.body,
      ADD,
    );
    if (!parsed.success) {
      ctx.response.body = parsed.response;
      return;
    }
    ctx.response.body = await UserService.add(parsed.data);
  });

  router.get(GET, jsonQsParser({onError: onJSONQsParseError}), async (ctx) => {
    const parsed = parseRequestPayload(
      AccountUsernamePayloadSchema,
      ctx.request.body,
      GET,
    );
    if (!parsed.success) {
      ctx.response.body = parsed.response;
      return;
    }
    ctx.response.body = await UserService.get(parsed.data.username);
  });

  router.post(MODIFY, async (ctx) => {
    const parsed = parseRequestPayload(
      UpdateAccountPayloadSchema,
      ctx.request.body,
      MODIFY,
    );
    if (!parsed.success) {
      ctx.response.body = parsed.response;
      return;
    }
    ctx.response.body = await UserService.modify(parsed.data);
  });
};
