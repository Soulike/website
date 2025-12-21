import {
  type Category,
  FailServerResponse,
  type ServerResponse,
  SuccessfulServerResponse,
} from '@module/classes';

import {Category as CategoryTable} from '../Database/index.js';

export async function getAll(): Promise<ServerResponse<Category[]>> {
  return await CategoryTable.getAll();
}

export async function getById(id: number): Promise<ServerResponse<Category>> {
  const serverResponse = await CategoryTable.get({id});
  if (serverResponse.isSuccessful) {
    const {data} = serverResponse;
    if (data.length !== 0) {
      return new SuccessfulServerResponse(data[0]);
    } else {
      return new FailServerResponse('文章分类不存在');
    }
  } else {
    const {message} = serverResponse;
    return new FailServerResponse(message);
  }
}
