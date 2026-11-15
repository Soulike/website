import {z} from 'zod';

import {
  type FailServerResponse,
  FailServerResponseSchema,
  type ServerError,
} from './error.js';

function createServerResponseUnion<TDataSchema extends z.ZodType>(
  dataSchema: TDataSchema,
) {
  return z.discriminatedUnion('isSuccessful', [
    z.strictObject({
      isSuccessful: z.literal(true),
      data: dataSchema,
    }),
    FailServerResponseSchema,
  ]);
}

export const VoidServerResponseSchema = createServerResponseUnion(z.null());
export type VoidServerResponse = z.infer<typeof VoidServerResponseSchema>;

export type ServerResponse<TData = null> =
  {isSuccessful: true; data: TData} | FailServerResponse;

export function createServerResponseSchema(): typeof VoidServerResponseSchema;
export function createServerResponseSchema<TDataSchema extends z.ZodType>(
  dataSchema: TDataSchema,
): z.ZodType<ServerResponse<z.infer<TDataSchema>>>;
export function createServerResponseSchema<TDataSchema extends z.ZodType>(
  dataSchema?: TDataSchema,
): z.ZodType {
  if (dataSchema === undefined) {
    return VoidServerResponseSchema;
  }
  return createServerResponseUnion(dataSchema);
}

export function successResponse(): {isSuccessful: true; data: null};
export function successResponse<TData>(data: TData): {
  isSuccessful: true;
  data: TData;
};
export function successResponse<TData>(...args: [] | [TData]): {
  isSuccessful: true;
  data: TData | null;
} {
  if (args.length === 0) {
    return {isSuccessful: true, data: null};
  }
  return {isSuccessful: true, data: args[0]};
}

export function failResponse(error: ServerError): FailServerResponse {
  return {
    isSuccessful: false,
    error,
  };
}
