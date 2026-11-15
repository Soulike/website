import {z} from 'zod';

// Column bounds follow modules/server/database/src/tables/tables.sql ("categories").
export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
});
export type Category = z.infer<typeof CategorySchema>;

export const CategoryDraftSchema = z.object({
  name: z.string().trim().min(1).max(255),
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
