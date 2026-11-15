import {type Article, type ArticleAbstract} from '@schema/blog';
import {failResponse, type ServerResponse, successResponse} from '@schema/rpc';

import {Article as ArticleTable} from '../Database/index.js';

export async function getAllWithAbstract(): Promise<
  ServerResponse<ArticleAbstract[]>
> {
  const serverResponse = await ArticleTable.get({isVisible: true});
  if (!serverResponse.isSuccessful) {
    return failResponse(serverResponse.error);
  }
  const {data: articles} = serverResponse;
  return successResponse(
    articles.map((article) => ({
      ...article,
      content: article.content.slice(0, 301), // 仅保留 300 个字符
    })),
  );
}

export async function getById(
  id: Article['id'],
): Promise<ServerResponse<Article>> {
  const serverResponse = await ArticleTable.get({
    id,
    isVisible: true,
  });
  if (!serverResponse.isSuccessful) {
    return failResponse(serverResponse.error);
  }
  const {data} = serverResponse;
  if (data.length === 0) {
    return failResponse({code: 'ARTICLE_NOT_FOUND'});
  }
  const addPageViewResponse = await ArticleTable.addPageView(id);
  if (!addPageViewResponse.isSuccessful) {
    return failResponse(addPageViewResponse.error);
  }
  return successResponse(data[0]);
}

export async function getByCategoryWithAbstract(
  category: Article['category'],
): Promise<ServerResponse<ArticleAbstract[]>> {
  const serverResponse = await ArticleTable.get({category, isVisible: true});
  if (!serverResponse.isSuccessful) {
    return failResponse(serverResponse.error);
  }
  const {data: articles} = serverResponse;
  return successResponse(
    articles.map((article) => ({
      ...article,
      content: article.content.slice(0, 301), // 仅保留 300 个字符
    })),
  );
}
