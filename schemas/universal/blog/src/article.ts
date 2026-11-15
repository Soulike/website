import {z} from 'zod';

// Column bounds follow modules/server/database/src/tables/tables.sql ("articles").
export const ArticleSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  content: z.string(),
  category: z.number().int().positive(),
  publicationTime: z.iso.datetime(),
  modificationTime: z.iso.datetime(),
  pageViews: z.number().int().nonnegative(),
  isVisible: z.boolean(),
});
export type Article = z.infer<typeof ArticleSchema>;

// Retains the current wire projection until a dedicated abstract shape is introduced.
export const ArticleAbstractSchema = ArticleSchema;
export type ArticleAbstract = z.infer<typeof ArticleAbstractSchema>;

export const ArticleDraftSchema = z.object({
  title: z.string().trim().min(1).max(255),
  content: z.string().refine((value) => value.trim().length > 0),
  category: z.number().int().positive(),
  isVisible: z.boolean(),
});
export type ArticleDraft = z.infer<typeof ArticleDraftSchema>;

export const UpdateArticleSchema = z
  .object({
    id: ArticleSchema.shape.id,
    ...ArticleDraftSchema.partial().shape,
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.content !== undefined ||
      value.category !== undefined ||
      value.isVisible !== undefined,
    {message: 'At least one modifiable field is required'},
  );
export type UpdateArticle = z.infer<typeof UpdateArticleSchema>;
