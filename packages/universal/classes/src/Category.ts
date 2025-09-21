import {z} from 'zod';

import {Nullable} from './types.js';

export type CategoryIdToArticleAmount = Record<Category['id'], number>;

interface CategoryBase {
  name: string;
}

export class NewCategory implements CategoryBase {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public static validateFormInput(
    newCategory: Partial<Nullable<NewCategory>>,
    onValidationFailed?: (message: string) => void,
  ): boolean {
    const {name} = newCategory;
    if (!name) {
      onValidationFailed?.('Please input category');
      return false;
    }
    return true;
  }
}

export class Category implements CategoryBase, z.infer<typeof Category.schema> {
  private static readonly schema = z.object({
    id: z.number(),
    name: z.string(),
  });

  public id: number; // 自增主键
  public name: string; // 分类名，唯一

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static validate(value: unknown): value is z.infer<typeof Category.schema> {
    const result = Category.schema.safeParse(value);
    return result.success;
  }

  static from(obj: unknown): Category {
    if (!Category.validate(obj)) {
      throw new Error('Invalid Category');
    }
    const {id, name} = obj;
    return new Category(id, name);
  }
}
