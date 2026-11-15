import {
  type Article,
  type ArticleDraft,
  ArticleSchema,
  type UpdateArticle,
} from '@schema/blog';
import {
  createServerResponseSchema,
  type ServerResponse,
  VoidServerResponseSchema,
} from '@schema/rpc';
import {z} from 'zod';

import {databaseRequest} from '../CONFIG.js';
import {
  ADD,
  ADD_PAGE_VIEW,
  COUNT,
  COUNT_ALL,
  DELETE_BY_ID,
  GET,
  GET_ALL,
  GET_BY_DATE,
  MODIFY,
} from './ROUTE.js';

const ArticleArrayResponseSchema = createServerResponseSchema(
  z.array(ArticleSchema),
);
const CountResponseSchema = createServerResponseSchema(
  z.number().int().nonnegative(),
);

export async function add(article: ArticleDraft): Promise<ServerResponse> {
  return VoidServerResponseSchema.parse(
    await databaseRequest.post<unknown>(ADD, article),
  );
}

export async function deleteById(id: Article['id']): Promise<ServerResponse> {
  return VoidServerResponseSchema.parse(
    await databaseRequest.post<unknown>(DELETE_BY_ID, {id}),
  );
}

export async function modify(article: UpdateArticle): Promise<ServerResponse> {
  return VoidServerResponseSchema.parse(
    await databaseRequest.post<unknown>(MODIFY, article),
  );
}

export async function get(
  article: Partial<Article>,
): Promise<ServerResponse<Article[]>> {
  return ArticleArrayResponseSchema.parse(
    await databaseRequest.get<unknown>(GET, {
      json: JSON.stringify(article),
    }),
  );
}

export async function getAll(): Promise<ServerResponse<Article[]>> {
  return ArticleArrayResponseSchema.parse(
    await databaseRequest.get<unknown>(GET_ALL),
  );
}

export async function getByDate(
  year: number,
  month?: number,
  day?: number,
): Promise<ServerResponse<Article[]>> {
  return ArticleArrayResponseSchema.parse(
    await databaseRequest.get<unknown>(GET_BY_DATE, {
      json: JSON.stringify({year, month, day}),
    }),
  );
}

export async function count(
  article: Partial<Article>,
): Promise<ServerResponse<number>> {
  return CountResponseSchema.parse(
    await databaseRequest.get<unknown>(COUNT, {
      json: JSON.stringify(article),
    }),
  );
}

export async function countAll(): Promise<ServerResponse<number>> {
  return CountResponseSchema.parse(
    await databaseRequest.get<unknown>(COUNT_ALL),
  );
}

export async function addPageView(id: Article['id']): Promise<ServerResponse> {
  return VoidServerResponseSchema.parse(
    await databaseRequest.post<unknown>(ADD_PAGE_VIEW, {id}),
  );
}
