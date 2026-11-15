import {z} from 'zod';

// Column bounds follow modules/server/database/src/tables/tables.sql ("categories").
export const CategoryRowSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
});
export type CategoryRow = z.infer<typeof CategoryRowSchema>;

export const CategoryInsertRowSchema = CategoryRowSchema.omit({id: true});
export type CategoryInsertRow = z.infer<typeof CategoryInsertRowSchema>;

export const CategoryUpdateRowSchema = CategoryInsertRowSchema.partial();
export type CategoryUpdateRow = z.infer<typeof CategoryUpdateRowSchema>;
