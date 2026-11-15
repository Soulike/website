import {z} from 'zod';

// Column bounds follow modules/server/database/src/tables/tables.sql ("articles").
export const ArticleRowSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  content: z.string(),
  category: z.number().int().positive(),
  publicationTime: z.date(),
  modificationTime: z.date(),
  pageViews: z.number().int().nonnegative(),
  isVisible: z.boolean(),
});
export type ArticleRow = z.infer<typeof ArticleRowSchema>;

export const ArticleInsertRowSchema = ArticleRowSchema.omit({id: true});
export type ArticleInsertRow = z.infer<typeof ArticleInsertRowSchema>;

export const ArticleUpdateRowSchema = ArticleInsertRowSchema.partial();
export type ArticleUpdateRow = z.infer<typeof ArticleUpdateRowSchema>;
