import {Category} from '@website/classes';

import {Category as CategoryApi} from '@/src/apis';

export class CategoryModelViewModel {
  public static async getAllCategories(): Promise<Category[]> {
    const response = await CategoryApi.getAll();
    if (response.isSuccessful) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  }
}
