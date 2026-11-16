import {
  type Article,
  type ArticleDraft,
  type UpdateArticle,
} from '@schema/blog';
import {failResponse, type ServerResponse, successResponse} from '@schema/rpc';

import {Article as ArticleTable} from '../Database/index.js';

export async function getById(
  id: Article['id'],
): Promise<ServerResponse<Article>> {
  const serverResponse = await ArticleTable.get({id});
  if (!serverResponse.isSuccessful) {
    return failResponse(serverResponse.error);
  }
  const [article] = serverResponse.data;
  if (article === undefined) {
    return failResponse({code: 'ARTICLE_NOT_FOUND'});
  }
  return successResponse(article);
}

export async function getAll(): Promise<ServerResponse<Article[]>> {
  return await ArticleTable.getAll();
}

export async function getByCategory(
  category: Article['category'],
): Promise<ServerResponse<Article[]>> {
  return await ArticleTable.get({category});
}

export async function add(article: ArticleDraft): Promise<ServerResponse> {
  return await ArticleTable.add(article);
}

export async function deleteById(id: Article['id']): Promise<ServerResponse> {
  return await ArticleTable.deleteById(id);
}

export async function modify(article: UpdateArticle): Promise<ServerResponse> {
  return await ArticleTable.modify(article);
}
