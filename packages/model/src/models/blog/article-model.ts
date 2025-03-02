import path from 'node:path/posix';

import {Article, ArticleBase, ServerResponse} from '@website/classes';
import {Request} from '@website/request';

import {prependBlogPrefix} from './path-helper.js';

export class ArticleModel {
  private static readonly PATH = Object.freeze({
    GET_BY_ID: ArticleModel.prependArticlePrefix('/getById'),
    GET_ALL: ArticleModel.prependArticlePrefix('/getAll'),
    GET_BY_CATEGORY: ArticleModel.prependArticlePrefix('/getByCategory'),
    ADD: ArticleModel.prependArticlePrefix('/add'),
    DELETE_BY_ID: ArticleModel.prependArticlePrefix('/deleteById'),
    MODIFY: ArticleModel.prependArticlePrefix('/modify'),
  });

  private static prependArticlePrefix(subPath: string): string {
    return prependBlogPrefix(path.join('article', subPath));
  }

  public async getById(id: Article['id']): Promise<Article> {
    const response = await Request.JSONToJSON.get<ServerResponse<Article>>(
      ArticleModel.PATH.GET_BY_ID,
      {
        searchParams: new URLSearchParams({json: JSON.stringify({id})}),
      },
    );
    if (!response.isSuccessful) {
      throw new Error(response.message);
    } else {
      return response.data;
    }
  }

  public async getByAll(): Promise<Article[]> {
    const response = await Request.JSONToJSON.get<ServerResponse<Article[]>>(
      ArticleModel.PATH.GET_ALL,
    );
    if (!response.isSuccessful) {
      throw new Error(response.message);
    } else {
      return response.data;
    }
  }

  public async getByCategory(
    category: Article['category'],
  ): Promise<Article[]> {
    const response = await Request.JSONToJSON.get<ServerResponse<Article[]>>(
      ArticleModel.PATH.GET_BY_CATEGORY,
      {
        searchParams: new URLSearchParams({
          json: JSON.stringify({category}),
        }),
      },
    );
    if (!response.isSuccessful) {
      throw new Error(response.message);
    } else {
      return response.data;
    }
  }

  public async add(article: ArticleBase): Promise<void> {
    const response = await Request.JSONToJSON.post<ServerResponse<void>>(
      ArticleModel.PATH.ADD,
      {
        body: article,
      },
    );

    if (!response.isSuccessful) {
      throw new Error(response.message);
    }
  }

  public async deleteById(id: Article['id']): Promise<void> {
    const response = await Request.JSONToJSON.post<ServerResponse<void>>(
      ArticleModel.PATH.DELETE_BY_ID,
      {
        body: {id},
      },
    );

    if (!response.isSuccessful) {
      throw new Error(response.message);
    }
  }

  public async modify(
    id: Article['id'],
    modifiedParts: Partial<ArticleBase>,
  ): Promise<void> {
    const response = await Request.JSONToJSON.post<ServerResponse<void>>(
      ArticleModel.PATH.MODIFY,
      {
        body: {id, ...modifiedParts},
      },
    );
    if (!response.isSuccessful) {
      throw new Error(response.message);
    }
  }
}
