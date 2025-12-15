import {
  type Category,
  FailServerResponse,
  type ServerResponse,
  SuccessfulServerResponse,
} from '@module/classes';

import {Category as CategoryTable} from '../Database/index.js';

export async function get(
  category: Partial<Category>,
): Promise<ServerResponse<Category[]>> {
  const categories = await CategoryTable.select(category);
  return new SuccessfulServerResponse(categories);
}

export async function getAll(): Promise<ServerResponse<Category[]>> {
  const categories = await CategoryTable.selectAll();
  return new SuccessfulServerResponse(categories);
}

export async function add(
  category: Omit<Category, 'id'>,
): Promise<ServerResponse<void>> {
  const {name} = category;
  if ((await CategoryTable.count({name})) !== 0) {
    return new FailServerResponse('分类已存在');
  }
  await CategoryTable.insert(category);
  return new SuccessfulServerResponse(undefined);
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  if ((await CategoryTable.count({id})) === 0) {
    return new FailServerResponse('分类不存在');
  }
  const articleAmount = await CategoryTable.countArticlesById(id);
  if (articleAmount !== 0) {
    return new FailServerResponse(
      `文章分类仍被 ${articleAmount} 个文章使用，删除失败`,
    );
  }
  await CategoryTable.deleteById(id);
  return new SuccessfulServerResponse(undefined);
}

export async function modify(
  category: Partial<Category> & Pick<Category, 'id'>,
): Promise<ServerResponse<void>> {
  const {id, name} = category;
  if ((await CategoryTable.count({id})) === 0) {
    return new FailServerResponse('分类不存在');
  }
  if ((await CategoryTable.count({name})) !== 0) {
    return new FailServerResponse('分类已存在');
  }
  await CategoryTable.update(category);
  return new SuccessfulServerResponse(undefined);
}

export async function countArticleById(
  id: number,
): Promise<ServerResponse<number>> {
  if ((await CategoryTable.count({id})) === 0) {
    return new FailServerResponse('分类不存在');
  }
  const articleAmount = await CategoryTable.countArticlesById(id);
  return new SuccessfulServerResponse(articleAmount);
}
