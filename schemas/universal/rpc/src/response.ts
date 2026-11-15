import {z} from 'zod';

import {
  type FailServerResponse,
  FailServerResponseSchema,
  type ServerError,
} from './error.js';

export const VoidServerResponseSchema = z.discriminatedUnion('isSuccessful', [
  z.object({
    isSuccessful: z.literal(true),
    data: z.undefined().optional(),
  }),
  FailServerResponseSchema,
]);
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
  return z.discriminatedUnion('isSuccessful', [
    z.object({
      isSuccessful: z.literal(true),
      data: dataSchema,
    }),
    FailServerResponseSchema,
  ]);
}

export function successResponse(): {isSuccessful: true};
export function successResponse<TData>(data: TData): {
  isSuccessful: true;
  data: TData;
};
export function successResponse<TData>(data?: TData): {
  isSuccessful: true;
  data?: TData;
} {
  if (arguments.length === 0) {
    return {isSuccessful: true};
  }
  return {isSuccessful: true, data};
}

export function failResponse(error: ServerError): FailServerResponse {
  return {
    isSuccessful: false,
    error,
  };
}
