import {Article, Category} from '@website/classes';

import * as ArticleApi from '@/src/apis/article';
import * as CategoryApi from '@/src/apis/category';

export class ArticleViewModel {
  public static async getArticle(id: number): Promise<Article> {
    const response = await ArticleApi.getById(id);
    if (response.isSuccessful) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  }

  public static async getCategory(id: number): Promise<Category> {
    const response = await CategoryApi.getById(id);
    if (response.isSuccessful) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  }
}
