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
    const newArticle = ArticleRowSchema.parse({id, ...parsedArticle});
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
    const filteredArticle = removeUndefinedFieldsShallow(article);
    if (isObjectEmpty(filteredArticle)) {
      return;
    }

    const index = this.articles.findIndex((a) => a.id === id);
    if (index !== -1) {
      await Promise.resolve();
      Object.assign(this.articles[index], filteredArticle);
    }
  }

  static async selectById(id: ArticleRow['id']): Promise<ArticleRow | null> {
    const article = this.articles.find((a) => a.id === id);
    await Promise.resolve();
    return article ? ArticleRowSchema.parse(article) : null;
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
    if (isObjectEmpty(article)) {
      return this.sortArticles([...this.articles], orderConfig);
    }

    const filteredArticles = this.articles.filter((a) => {
      return Object.entries(article).every(([key, value]) => {
        return a[key as keyof ArticleRow] === value;
      });
    });

    await Promise.resolve();
    return this.sortArticles(filteredArticles, orderConfig);
  }

  static async countAll(): Promise<number> {
    await Promise.resolve();
    return this.articles.length;
  }

  static async count(article: Partial<ArticleRow>): Promise<number> {
    if (isObjectEmpty(article)) {
      return this.countAll();
    }

    const filteredArticles = this.articles.filter((a) => {
      return Object.entries(article).every(([key, value]) => {
        return a[key as keyof ArticleRow] === value;
      });
    });

    return filteredArticles.length;
  }

  private static sortArticles(
    articles: ArticleRow[],
    orderConfig: OrderConfig<ArticleRow>,
  ): ArticleRow[] {
    const sortedArticles = sortEntities(articles, orderConfig);
    return sortedArticles.map((article) => ArticleRowSchema.parse(article));
  }
}
