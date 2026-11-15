import {z} from 'zod';

import {
  type FailServerResponse,
  FailServerResponseSchema,
  type ServerError,
} from './error.js';

function createServerResponseUnion<TSuccessShape extends z.ZodRawShape>(
  successShape: TSuccessShape,
) {
  return z.discriminatedUnion('isSuccessful', [
    z.object({
      isSuccessful: z.literal(true),
      ...successShape,
    }),
    FailServerResponseSchema,
  ]);
}

export const VoidServerResponseSchema = createServerResponseUnion({
  data: z.undefined().optional(),
});
export type VoidServerResponse = z.infer<typeof VoidServerResponseSchema>;

export type ServerResponse<TData> =
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
  return createServerResponseUnion({
    data: dataSchema,
  });
}

export function successResponse(): {isSuccessful: true};
export function successResponse<TData>(data: TData): {
  isSuccessful: true;
  data: TData;
};
export function successResponse<TData>(...args: [] | [TData]): {
  isSuccessful: true;
  data?: TData;
} {
  if (args.length === 0) {
    return {isSuccessful: true};
  }
  return {isSuccessful: true, data: args[0]};
}

export function failResponse(error: ServerError): FailServerResponse {
  return {
    isSuccessful: false,
    error,
  };
}
