import {
  type Category,
  type CategoryDraft,
  type UpdateCategory,
} from '@schema/blog';
import {failResponse, type ServerResponse, successResponse} from '@schema/rpc';

import {Category as CategoryTable} from '../Database/index.js';

export async function get(
  category: Partial<Category>,
): Promise<ServerResponse<Category[]>> {
  const categories = await CategoryTable.select(category);
  return successResponse(categories);
}

export async function getAll(): Promise<ServerResponse<Category[]>> {
  const categories = await CategoryTable.selectAll();
  return successResponse(categories);
}

export async function add(category: CategoryDraft): Promise<ServerResponse> {
  const {name} = category;
  if ((await CategoryTable.count({name})) !== 0) {
    return failResponse({code: 'CATEGORY_ALREADY_EXISTS'});
  }
  await CategoryTable.insert(category);
  return successResponse();
}

export async function deleteById(id: Category['id']): Promise<ServerResponse> {
  if ((await CategoryTable.count({id})) === 0) {
    return failResponse({code: 'CATEGORY_NOT_FOUND'});
  }
  const articleAmount = await CategoryTable.countArticlesById(id);
  if (articleAmount !== 0) {
    return failResponse({
      code: 'CATEGORY_IN_USE',
      details: {articleAmount},
    });
  }
  await CategoryTable.deleteById(id);
  return successResponse();
}

export async function modify(
  category: UpdateCategory,
): Promise<ServerResponse> {
  const {id, name} = category;
  if ((await CategoryTable.count({id})) === 0) {
    return failResponse({code: 'CATEGORY_NOT_FOUND'});
  }
  if ((await CategoryTable.count({name})) !== 0) {
    return failResponse({code: 'CATEGORY_ALREADY_EXISTS'});
  }
  await CategoryTable.update(category);
  return successResponse();
}

export async function countArticleById(
  id: Category['id'],
): Promise<ServerResponse<number>> {
  if ((await CategoryTable.count({id})) === 0) {
    return failResponse({code: 'CATEGORY_NOT_FOUND'});
  }
  const articleAmount = await CategoryTable.countArticlesById(id);
  return successResponse(articleAmount);
}
