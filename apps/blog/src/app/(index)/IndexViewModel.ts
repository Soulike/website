import {Article} from '@website/classes';

import {Article as ArticleApi} from '@/src/apis';

export class IndexViewModel {
  public static async getArticlesWithAbstract(): Promise<Article[]> {
    const response = await ArticleApi.getAllWithAbstract();
    if (response.isSuccessful) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  }
}
