import {isObjectEmpty} from '@library/object-helpers';
import {Article} from '@module/classes';

import {OrderConfig} from '../types.js';
import {sortEntities} from './fake-table-helpers.js';

export class FakeArticleTable {
  private static articles: Article[] = [];
  private static idCounter = 1;

  static reset(): void {
    this.articles = [];
    this.idCounter = 1;
  }

  static async insert(article: Omit<Article, 'id'>): Promise<void> {
    const id = this.idCounter++;
    const newArticle = Article.from({id, ...article});
    await Promise.resolve();
    this.articles.push(newArticle);
  }

  static async deleteById(id: Article['id']): Promise<void> {
    await Promise.resolve();
    this.articles = this.articles.filter((article) => article.id !== id);
  }

  static async updateById(
    id: Article['id'],
    article: Partial<Omit<Article, 'id'>>,
  ): Promise<void> {
    if (isObjectEmpty(article)) {
      return;
    }

    const index = this.articles.findIndex((a) => a.id === id);
    if (index !== -1) {
      await Promise.resolve();
      Object.assign(this.articles[index], article);
    }
  }

  static async selectById(id: Article['id']): Promise<Article | null> {
    const article = this.articles.find((article) => article.id === id);
    await Promise.resolve();
    return article ? Article.from(article) : null;
  }

  static async selectAll(
    orderConfig: OrderConfig<Article> = {},
  ): Promise<Article[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    article: Partial<Article>,
    orderConfig: OrderConfig<Article> = {},
  ): Promise<Article[]> {
    if (isObjectEmpty(article)) {
      return this.sortArticles([...this.articles], orderConfig);
    }

    const filteredArticles = this.articles.filter((a) => {
      return Object.entries(article).every(([key, value]) => {
        return a[key as keyof Article] === value;
      });
    });

    await Promise.resolve();
    return this.sortArticles(filteredArticles, orderConfig);
  }

  static async countAll(): Promise<number> {
    await Promise.resolve();
    return this.articles.length;
  }

  static async count(article: Partial<Article>): Promise<number> {
    if (isObjectEmpty(article)) {
      return this.countAll();
    }

    const filteredArticles = this.articles.filter((a) => {
      return Object.entries(article).every(([key, value]) => {
        return a[key as keyof Article] === value;
      });
    });

    return filteredArticles.length;
  }

  private static sortArticles(
    articles: Article[],
    orderConfig: OrderConfig<Article>,
  ): Article[] {
    const sortedArticles = sortEntities(articles, orderConfig);
    return sortedArticles.map((article) => Article.from(article));
  }
}
