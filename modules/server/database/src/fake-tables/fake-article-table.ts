import {
  isObjectEmpty,
  removeUndefinedFieldsShallow,
} from '@library/object-helpers';
import {
  type ArticleInsertRow,
  ArticleInsertRowSchema,
  type ArticleRow,
  ArticleRowSchema,
  type ArticleUpdateRow,
  type OrderConfig,
} from '@schema/database';

import {sortEntities} from './fake-table-helpers.js';

function matchesArticleFilter(
  row: ArticleRow,
  filter: Partial<ArticleRow>,
): boolean {
  return Object.entries(filter).every(([key, value]) => {
    const rowValue = row[key as keyof ArticleRow];
    if (rowValue instanceof Date && value instanceof Date) {
      return rowValue.getTime() === value.getTime();
    }
    return rowValue === value;
  });
}

function cloneArticleRow(row: ArticleRow): ArticleRow {
  return {
    ...row,
    publicationTime: new Date(row.publicationTime.getTime()),
    modificationTime: new Date(row.modificationTime.getTime()),
  };
}

function cloneArticleUpdate(article: ArticleUpdateRow): ArticleUpdateRow {
  return {
    ...article,
    ...(article.publicationTime !== undefined
      ? {publicationTime: new Date(article.publicationTime.getTime())}
      : {}),
    ...(article.modificationTime !== undefined
      ? {modificationTime: new Date(article.modificationTime.getTime())}
      : {}),
  };
}

export class FakeArticleTable {
  private static articles: ArticleRow[] = [];
  private static idCounter = 1;

  static reset(): void {
    this.articles = [];
    this.idCounter = 1;
  }

  static async insert(article: ArticleInsertRow): Promise<void> {
    const id = this.idCounter++;
    const parsedArticle = ArticleInsertRowSchema.parse(article);
    const newArticle = cloneArticleRow(
      ArticleRowSchema.parse({id, ...parsedArticle}),
    );
    await Promise.resolve();
    this.articles.push(newArticle);
  }

  static async deleteById(id: ArticleRow['id']): Promise<void> {
    await Promise.resolve();
    this.articles = this.articles.filter((article) => article.id !== id);
  }

  static async updateById(
    id: ArticleRow['id'],
    article: ArticleUpdateRow,
  ): Promise<void> {
    const filteredArticle = cloneArticleUpdate(
      removeUndefinedFieldsShallow(article),
    );
    if (isObjectEmpty(filteredArticle)) {
      return;
    }

    const existingArticle = this.articles.find((a) => a.id === id);
    if (existingArticle !== undefined) {
      await Promise.resolve();
      Object.assign(existingArticle, filteredArticle);
    }
  }

  static async selectById(id: ArticleRow['id']): Promise<ArticleRow | null> {
    const article = this.articles.find((a) => a.id === id);
    await Promise.resolve();
    return article ? cloneArticleRow(ArticleRowSchema.parse(article)) : null;
  }

  static async selectAll(
    orderConfig: OrderConfig<ArticleRow> = {},
  ): Promise<ArticleRow[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    article: Partial<ArticleRow>,
    orderConfig: OrderConfig<ArticleRow> = {},
  ): Promise<ArticleRow[]> {
    const filteredConfig = removeUndefinedFieldsShallow(article);
    if (isObjectEmpty(filteredConfig)) {
      return this.sortArticles([...this.articles], orderConfig);
    }

    const filteredArticles = this.articles.filter((a) =>
      matchesArticleFilter(a, filteredConfig),
    );

    await Promise.resolve();
    return this.sortArticles(filteredArticles, orderConfig);
  }

  static async countAll(): Promise<number> {
    await Promise.resolve();
    return this.articles.length;
  }

  static async count(article: Partial<ArticleRow>): Promise<number> {
    const filteredConfig = removeUndefinedFieldsShallow(article);
    if (isObjectEmpty(filteredConfig)) {
      return this.countAll();
    }

    const filteredArticles = this.articles.filter((a) =>
      matchesArticleFilter(a, filteredConfig),
    );

    return filteredArticles.length;
  }

  private static sortArticles(
    articles: ArticleRow[],
    orderConfig: OrderConfig<ArticleRow>,
  ): ArticleRow[] {
    const sortedArticles = sortEntities(articles, orderConfig);
    return sortedArticles.map((article) =>
      cloneArticleRow(ArticleRowSchema.parse(article)),
    );
  }
}
