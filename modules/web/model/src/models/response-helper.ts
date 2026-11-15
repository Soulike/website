import {
  createServerResponseSchema,
  type ServerResponse,
  VoidServerResponseSchema,
} from '@schema/rpc';
import {type z} from 'zod';

import {ModelAccessDeniedError} from './model-access-error.js';

export function parseVoidServerResponse(raw: unknown): void {
  const parsed = VoidServerResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('Malformed server response', {cause: parsed.error});
  }
  if (!parsed.data.isSuccessful) {
    throw new ModelAccessDeniedError(parsed.data.error);
  }
}

export function parseServerResponse<TSchema extends z.ZodType>(
  dataSchema: TSchema,
  raw: unknown,
): z.infer<TSchema> {
  const schema: z.ZodType<ServerResponse<z.infer<TSchema>>> =
    createServerResponseSchema(dataSchema);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('Malformed server response', {cause: parsed.error});
  }
  if (!parsed.data.isSuccessful) {
    throw new ModelAccessDeniedError(parsed.data.error);
  }
  return parsed.data.data;
}
