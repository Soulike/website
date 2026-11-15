import {ArticleRowSchema} from '@schema/database';
import {z} from 'zod';

export const ArticleSchema = ArticleRowSchema.extend({
  publicationTime: z.iso.datetime(),
  modificationTime: z.iso.datetime(),
});
export type Article = z.infer<typeof ArticleSchema>;

// Retains the current wire projection until a dedicated abstract shape is introduced.
export const ArticleAbstractSchema = ArticleSchema;
export type ArticleAbstract = z.infer<typeof ArticleAbstractSchema>;

export const ArticleDraftSchema = z.object({
  title: z.string().trim().pipe(ArticleRowSchema.shape.title),
  content: ArticleRowSchema.shape.content.refine(
    (value) => value.trim().length > 0,
  ),
  category: ArticleRowSchema.shape.category,
  isVisible: ArticleRowSchema.shape.isVisible,
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
