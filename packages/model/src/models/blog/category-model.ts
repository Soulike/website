import path from 'node:path/posix';

import {
  Category,
  CategoryIdToArticleAmount,
  NewCategory,
  ServerResponse,
} from '@website/classes';
import {Request} from '@website/request';

import {ModelAccessDeniedError} from '../model-access-error.js';
import {prependBlogPrefix} from './path-helper.js';

export class CategoryModel {
  private static readonly PATH = Object.freeze({
    GET_ALL: CategoryModel.prependCategoryPrefix('/getAll'),
    // TODO: Review the name of the API. `getAllArticleAmountGroupedById` should be better.
    GET_ALL_ARTICLE_AMOUNT_BY_ID: CategoryModel.prependCategoryPrefix(
      '/getAllArticleAmountById',
    ),
    GET_ARTICLE_AMOUNT_BY_ID: CategoryModel.prependCategoryPrefix(
      '/getArticleAmountById',
    ),
    ADD: CategoryModel.prependCategoryPrefix('/add'),
    DELETE_BY_ID: CategoryModel.prependCategoryPrefix('/deleteById'),
    MODIFY: CategoryModel.prependCategoryPrefix('/modify'),
  });

  private static prependCategoryPrefix(subPath: string): string {
    return prependBlogPrefix(path.join('category', subPath));
  }

  public async getAll(): Promise<Category[]> {
    const response = await Request.JSONToJSON.get<ServerResponse<Category[]>>(
      CategoryModel.PATH.GET_ALL,
    );
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    } else {
      return response.data;
    }
  }

  public async getAllArticleAmountGroupedById(): Promise<CategoryIdToArticleAmount> {
    const response = await Request.JSONToJSON.get<
      ServerResponse<CategoryIdToArticleAmount>
    >(CategoryModel.PATH.GET_ALL_ARTICLE_AMOUNT_BY_ID);
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    } else {
      return response.data;
    }
  }

  public async getArticleAmountById(id: Category['id']): Promise<number> {
    const response = await Request.JSONToJSON.get<ServerResponse<number>>(
      CategoryModel.PATH.GET_ARTICLE_AMOUNT_BY_ID,
      {
        searchParams: new URLSearchParams({
          json: JSON.stringify({id}),
        }),
      },
    );
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    } else {
      return response.data;
    }
  }

  public async add(category: NewCategory): Promise<void> {
    const response = await Request.JSONToJSON.post<ServerResponse<void>>(
      CategoryModel.PATH.ADD,
      {
        body: category,
      },
    );
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    }
  }

  public async deleteById(id: Category['id']): Promise<void> {
    const response = await Request.JSONToJSON.post<ServerResponse<void>>(
      CategoryModel.PATH.DELETE_BY_ID,
      {
        body: {id},
      },
    );
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    }
  }

  public async modify(
    id: Category['id'],
    modifiedParts: Partial<NewCategory>,
  ): Promise<void> {
    const response = await Request.JSONToJSON.post<ServerResponse<void>>(
      CategoryModel.PATH.MODIFY,
      {
        body: {id, ...modifiedParts},
      },
    );
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    }
  }
}
