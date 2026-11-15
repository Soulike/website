import {
  type Category,
  type CategoryDraft,
  CategorySchema,
  type UpdateCategory,
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
  COUNT_ARTICLE_BY_ID,
  DELETE_BY_ID,
  GET,
  GET_ALL,
  MODIFY,
} from './ROUTE.js';

const CategoryArrayResponseSchema = createServerResponseSchema(
  z.array(CategorySchema),
);
const CountResponseSchema = createServerResponseSchema(
  z.number().int().nonnegative(),
);

export async function get(
  category: Partial<Category>,
): Promise<ServerResponse<Category[]>> {
  return CategoryArrayResponseSchema.parse(
    await databaseRequest.get<unknown>(GET, {
      json: JSON.stringify(category),
    }),
  );
}

export async function getAll(): Promise<ServerResponse<Category[]>> {
  return CategoryArrayResponseSchema.parse(
    await databaseRequest.get<unknown>(GET_ALL),
  );
}

export async function add(category: CategoryDraft): Promise<ServerResponse> {
  return VoidServerResponseSchema.parse(
    await databaseRequest.post<unknown>(ADD, category),
  );
}

export async function deleteById(id: Category['id']): Promise<ServerResponse> {
  return VoidServerResponseSchema.parse(
    await databaseRequest.post<unknown>(DELETE_BY_ID, {id}),
  );
}

export async function modify(
  category: UpdateCategory,
): Promise<ServerResponse> {
  return VoidServerResponseSchema.parse(
    await databaseRequest.post<unknown>(MODIFY, category),
  );
}

export async function countArticleById(
  id: Category['id'],
): Promise<ServerResponse<number>> {
  return CountResponseSchema.parse(
    await databaseRequest.get<unknown>(COUNT_ARTICLE_BY_ID, {
      json: JSON.stringify({id}),
    }),
  );
}
