import {z} from 'zod';

import {AccountRowSchema} from './account.js';
import {ArticleRowSchema} from './article.js';
import {CategoryRowSchema} from './category.js';

export const OrderSchema = z.enum(['ASC', 'DESC']);
export type Order = z.infer<typeof OrderSchema>;

export type OrderConfig<T extends object> = Partial<Record<keyof T, Order>>;

export const AccountOrderConfigSchema = z.partialRecord(
  AccountRowSchema.keyof(),
  OrderSchema,
);
export type AccountOrderConfig = z.infer<typeof AccountOrderConfigSchema>;

export const CategoryOrderConfigSchema = z.partialRecord(
  CategoryRowSchema.keyof(),
  OrderSchema,
);
export type CategoryOrderConfig = z.infer<typeof CategoryOrderConfigSchema>;

export const ArticleOrderConfigSchema = z.partialRecord(
  ArticleRowSchema.keyof(),
  OrderSchema,
);
export type ArticleOrderConfig = z.infer<typeof ArticleOrderConfigSchema>;
