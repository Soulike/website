import {failResponse, type FailServerResponse} from '@schema/rpc';
import {type Context} from 'koa';
import signale from 'signale';
import {type z} from 'zod';

export function onJSONQsParseError(_e: unknown, ctx: Context): void {
  ctx.response.status = 400;
  ctx.response.body = failResponse({code: 'INVALID_REQUEST_PARAMS'});
}

export function parseRequestPayload<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
  routeLabel: string,
):
  | {success: true; data: z.infer<TSchema>}
  | {success: false; response: FailServerResponse} {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    signale.warn(`Invalid request payload for ${routeLabel}`, {
      issues: parsed.error.issues,
    });
    return {
      success: false,
      response: failResponse({code: 'INVALID_REQUEST_PARAMS'}),
    };
  }
  return {success: true, data: parsed.data};
}
