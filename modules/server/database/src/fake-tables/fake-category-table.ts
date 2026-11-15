import {
  isObjectEmpty,
  removeUndefinedFieldsShallow,
} from '@library/object-helpers';
import {
  type CategoryInsertRow,
  CategoryInsertRowSchema,
  type CategoryRow,
  CategoryRowSchema,
  type CategoryUpdateRow,
  type OrderConfig,
} from '@schema/database';

import {FakeArticleTable} from './fake-article-table.js';
import {sortEntities} from './fake-table-helpers.js';

export class FakeCategoryTable {
  private static categories: CategoryRow[] = [];
  private static idCounter = 1;

  static reset(): void {
    this.categories = [];
    this.idCounter = 1;
  }

  static async insert(category: CategoryInsertRow): Promise<void> {
    const id = this.idCounter++;
    const parsedCategory = CategoryInsertRowSchema.parse(category);
    const newCategory = CategoryRowSchema.parse({id, ...parsedCategory});
    await Promise.resolve();
    this.categories.push(newCategory);
  }

  static async deleteById(id: CategoryRow['id']): Promise<void> {
    await Promise.resolve();
    this.categories = this.categories.filter((category) => category.id !== id);
  }

  static async updateById(
    id: CategoryRow['id'],
    category: CategoryUpdateRow,
  ): Promise<void> {
    const filteredCategory = removeUndefinedFieldsShallow(category);
    if (isObjectEmpty(filteredCategory)) {
      return;
    }

    const index = this.categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      await Promise.resolve();
      Object.assign(this.categories[index], filteredCategory);
    }
  }

  static async selectById(id: CategoryRow['id']): Promise<CategoryRow | null> {
    const category = this.categories.find((c) => c.id === id);
    await Promise.resolve();
    return category ? CategoryRowSchema.parse(category) : null;
  }

  static async selectAll(
    orderConfig: OrderConfig<CategoryRow> = {},
  ): Promise<CategoryRow[]> {
    return this.select({}, orderConfig);
  }

  static async select(
    category: Partial<CategoryRow>,
    orderConfig: OrderConfig<CategoryRow> = {},
  ): Promise<CategoryRow[]> {
    if (isObjectEmpty(category)) {
      return this.sortCategories([...this.categories], orderConfig);
    }

    const filteredCategories = this.categories.filter((c) => {
      return Object.entries(category).every(([key, value]) => {
        return c[key as keyof CategoryRow] === value;
      });
    });

    await Promise.resolve();
    return this.sortCategories(filteredCategories, orderConfig);
  }

  static async countAll(): Promise<number> {
    await Promise.resolve();
    return this.categories.length;
  }

  static async count(category: Partial<CategoryRow>): Promise<number> {
    if (isObjectEmpty(category)) {
      return this.countAll();
    }

    const filteredCategories = this.categories.filter((c) => {
      return Object.entries(category).every(([key, value]) => {
        return c[key as keyof CategoryRow] === value;
      });
    });

    return filteredCategories.length;
  }

  static async countArticlesById(id: CategoryRow['id']): Promise<number> {
    await Promise.resolve();

    // Get all articles from FakeArticleTable with matching category ID
    const articlesWithCategory = await FakeArticleTable.select({category: id});
    return articlesWithCategory.length;
  }

  private static sortCategories(
    categories: CategoryRow[],
    orderConfig: OrderConfig<CategoryRow>,
  ): CategoryRow[] {
    const sortedCategories = sortEntities(categories, orderConfig);
    return sortedCategories.map((category) =>
      CategoryRowSchema.parse(category),
    );
  }
}
