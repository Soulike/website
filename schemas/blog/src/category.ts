import {CategoryRowSchema} from '@schema/database';
import {z} from 'zod';

export const CategorySchema = CategoryRowSchema;
export type Category = z.infer<typeof CategorySchema>;

export const CategoryDraftSchema = z.object({
  name: z.string().trim().pipe(CategoryRowSchema.shape.name),
});
export type CategoryDraft = z.infer<typeof CategoryDraftSchema>;

export const UpdateCategorySchema = z.object({
  id: CategorySchema.shape.id,
  name: CategoryDraftSchema.shape.name,
});
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

export const CategoryIdToArticleAmountSchema = z.record(
  z.string().regex(/^[1-9]\d*$/),
  z.number().int().nonnegative(),
);
export type CategoryIdToArticleAmount = z.infer<
  typeof CategoryIdToArticleAmountSchema
>;
