import {Article} from '@website/classes';

import {Article as ArticleApi} from '@/src/apis';

export class CategoryViewModel {
  public static async getArticlesWithAbstractByCategory(
    categoryId: number,
  ): Promise<Article[]> {
    const response = await ArticleApi.getByCategoryWithAbstract(categoryId);
    if (response.isSuccessful) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  }
}
