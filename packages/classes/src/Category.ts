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

export class Category implements CategoryBase {
  public id: number; // 自增主键
  public name: string; // 分类名，唯一

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static from(obj: Category): Category {
    return new Category(obj.id, obj.name);
  }
}
