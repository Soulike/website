import {isObjectEmpty} from '@library/object-helpers';
import {Category} from '@module/classes';

import {OrderConfig} from '@/types.js';

import {FakeArticleTable} from './fake-article-table.js';
import {sortEntities} from './fake-table-helpers.js';

export class FakeCategoryTable {
  private static categories: Category[] = [];
  private static idCounter = 1;

  static reset(): void {
    this.categories = [];
    this.idCounter = 1;
  }

  static async insert(category: Omit<Category, 'id'>): Promise<void> {
    const id = this.idCounter++;
    const newCategory = Category.from({id, ...category});
    await Promise.resolve();
    this.categories.push(newCategory);
  }

  static async deleteById(id: Category['id']): Promise<void> {
    await Promise.resolve();
    this.categories = this.categories.filter((category) => category.id !== id);
  }

  static async updateById(
    id: Category['id'],
    category: Partial<Omit<Category, 'id'>>,
  ): Promise<void> {
    if (isObjectEmpty(category)) {
      return;
    }

    const index = this.categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      await Promise.resolve();
      Object.assign(this.categories[index], category);
    }
  }

  static async selectById(id: Category['id']): Promise<Category | null> {
    const category = this.categories.find((category) => category.id === id);
    await Promise.resolve();
    return category ? Category.from(category) : null;
  }

  static async selectAll(
    orderConfig: OrderConfig<Category> = {},
  ): Promise<Category[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    category: Partial<Category>,
    orderConfig: OrderConfig<Category> = {},
  ): Promise<Category[]> {
    if (isObjectEmpty(category)) {
      return this.sortCategories([...this.categories], orderConfig);
    }

    const filteredCategories = this.categories.filter((c) => {
      return Object.entries(category).every(([key, value]) => {
        return c[key as keyof Category] === value;
      });
    });

    await Promise.resolve();
    return this.sortCategories(filteredCategories, orderConfig);
  }

  static async countAll(): Promise<number> {
    await Promise.resolve();
    return this.categories.length;
  }

  static async count(category: Partial<Category>): Promise<number> {
    if (isObjectEmpty(category)) {
      return this.countAll();
    }

    const filteredCategories = this.categories.filter((c) => {
      return Object.entries(category).every(([key, value]) => {
        return c[key as keyof Category] === value;
      });
    });

    return filteredCategories.length;
  }

  static async countArticlesById(id: Category['id']): Promise<number> {
    await Promise.resolve();

    // Get all articles from FakeArticleTable with matching category ID
    const articlesWithCategory = await FakeArticleTable.select({category: id});
    return articlesWithCategory.length;
  }

  private static sortCategories(
    categories: Category[],
    orderConfig: OrderConfig<Category>,
  ): Category[] {
    const sortedCategories = sortEntities(categories, orderConfig);
    return sortedCategories.map((category) => Category.from(category));
  }
}
