import {
  type Article,
  FailServerResponse,
  type ServerResponse,
  SuccessfulServerResponse,
} from '@module/classes';

import {Article as ArticleTable} from '../Database/index.js';

export async function getAllWithAbstract(): Promise<ServerResponse<Article[]>> {
  const serverResponse = await ArticleTable.get({isVisible: true});
  if (serverResponse.isSuccessful) {
    const {data: articles} = serverResponse;
    articles.forEach((article) => {
      article.content = article.content.slice(0, 301); // 仅保留 300 个字符
    });

    return new SuccessfulServerResponse(articles);
  } else {
    const {message} = serverResponse;
    return new FailServerResponse(message);
  }
}

export async function getById(id: number): Promise<ServerResponse<Article>> {
  const serverResponse = await ArticleTable.get({
    id,
    isVisible: true,
  });
  if (serverResponse.isSuccessful) {
    await ArticleTable.addPageView(id);
    const {data} = serverResponse;
    if (data.length !== 0) {
      const article = data[0];
      return new SuccessfulServerResponse(article);
    } else {
      return new FailServerResponse('文章不存在');
    }
  } else {
    const {message} = serverResponse;
    return new FailServerResponse(message);
  }
}

export async function getByCategoryWithAbstract(
  category: number,
): Promise<ServerResponse<Article[]>> {
  const serverResponse = await ArticleTable.get({category, isVisible: true});

  if (serverResponse.isSuccessful) {
    const {data: articles} = serverResponse;
    articles.forEach((article) => {
      article.content = article.content.slice(0, 301); // 仅保留 300 个字符
    });

    return new SuccessfulServerResponse(articles);
  } else {
    const {message} = serverResponse;
    return new FailServerResponse(message);
  }
}
