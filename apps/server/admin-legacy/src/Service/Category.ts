import {
  type Category,
  type CategoryDraft,
  type CategoryIdToArticleAmount,
  type UpdateCategory,
} from '@schema/blog';
import {failResponse, type ServerResponse, successResponse} from '@schema/rpc';

import {Category as CategoryTable} from '../Database/index.js';

export async function getById(
  id: Category['id'],
): Promise<ServerResponse<Category>> {
  const serverResponse = await CategoryTable.get({id});
  if (!serverResponse.isSuccessful) {
    return failResponse(serverResponse.error);
  }
  const [category] = serverResponse.data;
  if (category === undefined) {
    return failResponse({code: 'CATEGORY_NOT_FOUND'});
  }
  return successResponse(category);
}

export async function getAll(): Promise<ServerResponse<Category[]>> {
  return await CategoryTable.getAll();
}

export async function getAllArticleAmountById(): Promise<
  ServerResponse<CategoryIdToArticleAmount>
> {
  const categoryTableServerResponse = await CategoryTable.getAll();
  if (!categoryTableServerResponse.isSuccessful) {
    return failResponse(categoryTableServerResponse.error);
  }
  const {data: categories} = categoryTableServerResponse;
  const idToResponse: Record<string, ServerResponse<number>> = {};
  await Promise.all(
    categories.map(async (category) => {
      idToResponse[category.id] = await CategoryTable.countArticleById(
        category.id,
      );
    }),
  );

  const idToArticleAmount: CategoryIdToArticleAmount = {};

  for (const [id, categoryIdServerResponse] of Object.entries(idToResponse)) {
    if (!categoryIdServerResponse.isSuccessful) {
      return failResponse(categoryIdServerResponse.error);
    }
    idToArticleAmount[id] = categoryIdServerResponse.data;
  }

  return successResponse(idToArticleAmount);
}

export async function getArticleAmountById(
  id: Category['id'],
): Promise<ServerResponse<number>> {
  return await CategoryTable.countArticleById(id);
}

export async function add(category: CategoryDraft): Promise<ServerResponse> {
  return await CategoryTable.add(category);
}

export async function deleteById(id: Category['id']): Promise<ServerResponse> {
  return await CategoryTable.deleteById(id);
}

export async function modify(
  category: UpdateCategory,
): Promise<ServerResponse> {
  return await CategoryTable.modify(category);
}
