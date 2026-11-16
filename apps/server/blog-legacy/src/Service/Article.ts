import {type Article, type ArticleAbstract} from '@schema/blog';
import {failResponse, type ServerResponse, successResponse} from '@schema/rpc';

import {Article as ArticleTable} from '../Database/index.js';

function toArticleAbstract(article: Article): ArticleAbstract {
  return {
    ...article,
    content: article.content.slice(0, 301), // 仅保留 300 个字符
  };
}

export async function getAllWithAbstract(): Promise<
  ServerResponse<ArticleAbstract[]>
> {
  const serverResponse = await ArticleTable.get({isVisible: true});
  if (!serverResponse.isSuccessful) {
    return failResponse(serverResponse.error);
  }
  return successResponse(serverResponse.data.map(toArticleAbstract));
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
  const [article] = serverResponse.data;
  if (article === undefined) {
    return failResponse({code: 'ARTICLE_NOT_FOUND'});
  }
  const addPageViewResponse = await ArticleTable.addPageView(id);
  if (!addPageViewResponse.isSuccessful) {
    return failResponse(addPageViewResponse.error);
  }
  return successResponse(article);
}

export async function getByCategoryWithAbstract(
  category: Article['category'],
): Promise<ServerResponse<ArticleAbstract[]>> {
  const serverResponse = await ArticleTable.get({category, isVisible: true});
  if (!serverResponse.isSuccessful) {
    return failResponse(serverResponse.error);
  }
  return successResponse(serverResponse.data.map(toArticleAbstract));
}
