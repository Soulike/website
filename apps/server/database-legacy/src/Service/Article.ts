import {
  type Article,
  type ArticleDraft,
  type UpdateArticle,
} from '@schema/blog';
import {type ArticleRow, type ArticleUpdateRow} from '@schema/database';
import {failResponse, type ServerResponse, successResponse} from '@schema/rpc';

import {
  Article as ArticleTable,
  Category as CategoryTable,
} from '../Database/index.js';

function serializeArticleRow(row: ArticleRow): Article {
  return {
    ...row,
    publicationTime: row.publicationTime.toISOString(),
    modificationTime: row.modificationTime.toISOString(),
  };
}

function toArticleRowFilter(filter: Partial<Article>): Partial<ArticleRow> {
  const {publicationTime, modificationTime, ...rest} = filter;
  return {
    ...rest,
    ...(publicationTime === undefined
      ? {}
      : {publicationTime: new Date(publicationTime)}),
    ...(modificationTime === undefined
      ? {}
      : {modificationTime: new Date(modificationTime)}),
  };
}

export async function add(article: ArticleDraft): Promise<ServerResponse> {
  const {title, content, category, isVisible} = article;
  if ((await CategoryTable.count({id: category})) === 0) {
    return failResponse({code: 'ARTICLE_CATEGORY_NOT_FOUND'});
  }
  if ((await ArticleTable.countByTitle(title)) !== 0) {
    return failResponse({code: 'ARTICLE_TITLE_ALREADY_EXISTS'});
  }
  const nowDate = new Date();
  await ArticleTable.insert({
    title,
    content,
    category,
    publicationTime: nowDate,
    modificationTime: nowDate,
    pageViews: 0,
    isVisible,
  });
  return successResponse();
}

export async function deleteById(id: Article['id']): Promise<ServerResponse> {
  if ((await ArticleTable.count({id})) === 0) {
    return failResponse({code: 'ARTICLE_NOT_FOUND'});
  }
  await ArticleTable.deleteById(id);
  return successResponse();
}

export async function modify(article: UpdateArticle): Promise<ServerResponse> {
  const {id} = article;
  const articleInDatabase = await ArticleTable.selectById(id);
  if (articleInDatabase === null) {
    return failResponse({code: 'ARTICLE_NOT_FOUND'});
  }
  const newArticle: ArticleUpdateRow & Pick<ArticleRow, 'id'> = {...article};
  if (
    article.content !== undefined &&
    articleInDatabase.content !== article.content
  ) {
    newArticle.modificationTime = new Date();
  }
  await ArticleTable.update(newArticle);
  return successResponse();
}

export async function get(
  article: Partial<Article>,
): Promise<ServerResponse<Article[]>> {
  const articles = await ArticleTable.selectInPublicationTimeDescOrder(
    toArticleRowFilter(article),
  );
  return successResponse(articles.map(serializeArticleRow));
}

export async function getAll(): Promise<ServerResponse<Article[]>> {
  const articles = await ArticleTable.selectAllByPublicationTimeDescOrder();
  return successResponse(articles.map(serializeArticleRow));
}

export async function getByDate(
  year: number,
  month?: number,
  day?: number,
): Promise<ServerResponse<Article[]>> {
  const articles = await ArticleTable.selectByPublicationTimeDescOrder(
    year,
    month,
    day,
  );
  return successResponse(articles.map(serializeArticleRow));
}

export async function count(
  article: Partial<Article>,
): Promise<ServerResponse<number>> {
  const articleAmount = await ArticleTable.count(toArticleRowFilter(article));
  return successResponse(articleAmount);
}

export async function countAll(): Promise<ServerResponse<number>> {
  const articleAmount = await ArticleTable.countAll();
  return successResponse(articleAmount);
}

export async function addPageView(id: Article['id']): Promise<ServerResponse> {
  const articleInDatabase = await ArticleTable.selectById(id);
  if (articleInDatabase === null) {
    return failResponse({code: 'ARTICLE_NOT_FOUND'});
  }
  const {pageViews} = articleInDatabase;
  await ArticleTable.update({id, pageViews: pageViews + 1});
  return successResponse();
}
