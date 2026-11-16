import {type Category} from '@schema/blog';
import {failResponse, type ServerResponse, successResponse} from '@schema/rpc';

import {Category as CategoryTable} from '../Database/index.js';

export async function getAll(): Promise<ServerResponse<Category[]>> {
  return await CategoryTable.getAll();
}

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
