import {
  type Category,
  FailServerResponse,
  type ServerResponse,
  SuccessfulServerResponse,
} from '@module/classes';

import {Category as CategoryTable} from '../Database/index.js';

export async function getById(id: number): Promise<ServerResponse<Category>> {
  const serverResponse = await CategoryTable.get({id});
  if (serverResponse.isSuccessful) {
    const {data: categories} = serverResponse;
    if (categories.length === 0) {
      return new FailServerResponse('文章分类不存在');
    } else {
      return new SuccessfulServerResponse(categories[0]);
    }
  } else {
    const {message} = serverResponse;
    return new FailServerResponse(message);
  }
}

export async function getAll(): Promise<ServerResponse<Category[]>> {
  return await CategoryTable.getAll();
}

export async function getAllArticleAmountById(): Promise<
  ServerResponse<Record<number, number>>
> {
  const categoryTableServerResponse = await CategoryTable.getAll();
  if (categoryTableServerResponse.isSuccessful) {
    const {data: categories} = categoryTableServerResponse;
    const idToResponse: Record<string, ServerResponse<number>> = {};
    await Promise.all(
      categories.map(async (category) => {
        idToResponse[category.id] = await CategoryTable.countArticleById(
          category.id,
        );
      }),
    );

    const ids = Object.keys(idToResponse);
    const idToArticleAmount: Record<string, number> = {};

    for (const id of ids) {
      const categoryIdServerResponse = idToResponse[id];
      if (categoryIdServerResponse.isSuccessful) {
        const {data} = categoryIdServerResponse;
        idToArticleAmount[id] = data;
      } else {
        const {message} = categoryIdServerResponse;
        return new FailServerResponse(message);
      }
    }

    return new SuccessfulServerResponse(idToArticleAmount);
  } else {
    const {message} = categoryTableServerResponse;
    return new FailServerResponse(message);
  }
}

export async function getArticleAmountById(
  id: number,
): Promise<ServerResponse<number>> {
  return await CategoryTable.countArticleById(id);
}

export async function add(
  category: Omit<Category, 'id'>,
): Promise<ServerResponse<void>> {
  return await CategoryTable.add(category);
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  return await CategoryTable.deleteById(id);
}

export async function modify(
  category: Partial<Category> & Pick<Category, 'id'>,
): Promise<ServerResponse<void>> {
  return await CategoryTable.modify(category);
}
