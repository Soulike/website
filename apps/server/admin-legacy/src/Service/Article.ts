import {
  type Article,
  FailServerResponse,
  type ServerResponse,
  SuccessfulServerResponse,
} from '@module/classes';

import {Article as ArticleTable} from '../Database/index.js';

export async function getById(id: number): Promise<ServerResponse<Article>> {
  const serverResponse = await ArticleTable.get({id});
  if (serverResponse.isSuccessful) {
    const {data} = serverResponse;
    if (typeof data !== 'undefined' && data.length !== 0) {
      return new SuccessfulServerResponse(data[0]);
    } else {
      return new FailServerResponse('文章不存在');
    }
  } else {
    const {message} = serverResponse;
    return new FailServerResponse(message);
  }
}

export async function getAll(): Promise<ServerResponse<Article[]>> {
  return await ArticleTable.getAll();
}

export async function getByCategory(
  category: number,
): Promise<ServerResponse<Article[]>> {
  return await ArticleTable.get({category});
}

export async function add(
  article: Pick<Article, 'title' | 'content' | 'category' | 'isVisible'>,
): Promise<ServerResponse<void>> {
  return await ArticleTable.add(article);
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  return await ArticleTable.deleteById(id);
}

export async function modify(
  article: Pick<Article, 'id'> &
    Partial<
      Omit<Article, 'publicationTime' | 'modificationTime' | 'pageViews'>
    >,
): Promise<ServerResponse<void>> {
  return await ArticleTable.modify(article);
}
