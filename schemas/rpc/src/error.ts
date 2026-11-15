import {z} from 'zod';

export const ErrorCodeSchema = z.enum([
  'INVALID_REQUEST_PARAMS',
  'INVALID_DATE',
  'UNAUTHORIZED',
  'ACCOUNT_NOT_FOUND',
  'ACCOUNT_ALREADY_EXISTS',
  'CATEGORY_NOT_FOUND',
  'CATEGORY_ALREADY_EXISTS',
  'CATEGORY_IN_USE',
  'ARTICLE_NOT_FOUND',
  'ARTICLE_TITLE_ALREADY_EXISTS',
  'ARTICLE_CATEGORY_NOT_FOUND',
]);
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export const SimpleErrorCodeSchema = ErrorCodeSchema.exclude([
  'CATEGORY_IN_USE',
]);
export type SimpleErrorCode = z.infer<typeof SimpleErrorCodeSchema>;

export const CategoryInUseDetailsSchema = z.strictObject({
  articleAmount: z.number().int().nonnegative(),
});
export type CategoryInUseDetails = z.infer<typeof CategoryInUseDetailsSchema>;

export const SimpleServerErrorSchema = z.strictObject({
  code: SimpleErrorCodeSchema,
});

export const CategoryInUseErrorSchema = z.strictObject({
  code: z.literal('CATEGORY_IN_USE'),
  details: CategoryInUseDetailsSchema,
});

export const ServerErrorSchema = z.discriminatedUnion('code', [
  SimpleServerErrorSchema,
  CategoryInUseErrorSchema,
]);
export type ServerError = z.infer<typeof ServerErrorSchema>;

export const FailServerResponseSchema = z.strictObject({
  isSuccessful: z.literal(false),
  error: ServerErrorSchema,
});
export type FailServerResponse = z.infer<typeof FailServerResponseSchema>;
