import {
  type Article,
  FailServerResponse,
  type ServerResponse,
  SuccessfulServerResponse,
} from '@module/classes';

import {
  Article as ArticleTable,
  Category as CategoryTable,
} from '../Database/index.js';

export async function add(
  article: Pick<Article, 'title' | 'content' | 'category' | 'isVisible'>,
): Promise<ServerResponse<void>> {
  const {title, content, category, isVisible} = article;
  if ((await CategoryTable.count({id: category})) === 0) {
    return new FailServerResponse('文章分类不存在，请重新选择分类');
  }
  if ((await ArticleTable.countByTitle(title)) !== 0) {
    return new FailServerResponse('文章标题已存在，请修改文章标题');
  }
  const nowDate = new Date();
  await ArticleTable.insert({
    title,
    content,
    category,
    publicationTime: nowDate.toISOString(),
    modificationTime: nowDate.toISOString(),
    pageViews: 0,
    isVisible,
  });
  return new SuccessfulServerResponse(undefined);
}

export async function deleteById(id: number): Promise<ServerResponse<void>> {
  if ((await ArticleTable.count({id})) === 0) {
    return new FailServerResponse('文章不存在');
  }
  await ArticleTable.deleteById(id);
  return new SuccessfulServerResponse(undefined);
}

export async function modify(
  article: Pick<Article, 'id'> &
    Partial<
      Omit<Article, 'publicationTime' | 'modificationTime' | 'pageViews'>
    >,
): Promise<ServerResponse<void>> {
  const {id} = article;
  const articleInDatabase = await ArticleTable.selectById(id);
  if (articleInDatabase === null) {
    return new FailServerResponse('文章不存在');
  }
  const newArticle: Pick<Article, 'id'> &
    Partial<Omit<Article, 'publicationTime' | 'pageViews'>> = {...article};
  if (articleInDatabase.content !== article.content) {
    newArticle.modificationTime = new Date().toISOString();
  }
  await ArticleTable.update(newArticle);
  return new SuccessfulServerResponse(undefined);
}

export async function get(
  article: Partial<Article>,
): Promise<ServerResponse<Article[]>> {
  const articles = await ArticleTable.selectInPublicationTimeDescOrder(article);
  return new SuccessfulServerResponse(articles);
}

export async function getAll(): Promise<ServerResponse<Article[]>> {
  const articles: Article[] =
    await ArticleTable.selectAllByPublicationTimeDescOrder();
  return new SuccessfulServerResponse(articles);
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
  return new SuccessfulServerResponse(articles);
}

export async function count(
  article: Partial<Article>,
): Promise<ServerResponse<number>> {
  const articleAmount = await ArticleTable.count(article);
  return new SuccessfulServerResponse(articleAmount);
}

export async function countAll(): Promise<ServerResponse<number>> {
  const articleAmount = await ArticleTable.countAll();
  return new SuccessfulServerResponse(articleAmount);
}

export async function addPageView(id: number): Promise<ServerResponse<void>> {
  const articleInDatabase = await ArticleTable.selectById(id);
  if (articleInDatabase === null) {
    return new FailServerResponse('文章不存在');
  }
  const {pageViews} = articleInDatabase;
  const newArticle = {id, pageViews: pageViews + 1};
  await ArticleTable.update(newArticle);
  return new SuccessfulServerResponse(undefined);
}
