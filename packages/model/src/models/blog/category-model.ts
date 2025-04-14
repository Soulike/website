import path from 'node:path';

import {ModelAccessDeniedError} from '@models/model-access-error.js';
import {prependServerPrefix} from '@models/path-helper.js';
import {Category, ServerResponse} from '@website/classes';
import {Request} from '@website/request';

export class CategoryModel {
  private allCategoriesCache: Category[] | null = null;
  private idToCategoryCache = new Map<Category['id'], Category>();

  private static readonly PATH = Object.freeze({
    GET_ALL: CategoryModel.prependCategoryPrefix('/getAll'),
    GET_BY_ID: CategoryModel.prependCategoryPrefix('/getById'),
  });

  private static prependCategoryPrefix(subPath: string): string {
    return prependServerPrefix(path.join('category', subPath));
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

  /**
   * Only send a request for the first call. All following calls will return cache.
   * @param forceRefresh - Whether force refresh the cache.
   */
  public async getAllCache(forceRefresh = false): Promise<Category[]> {
    if (forceRefresh) {
      this.allCategoriesCache = null;
    }
    if (this.allCategoriesCache) {
      return this.allCategoriesCache;
    }
    const categories = await this.getAll();
    this.allCategoriesCache = categories;
    return categories;
  }

  public async getById(id: Category['id']): Promise<Category> {
    const response = await Request.JSONToJSON.get<ServerResponse<Category>>(
      CategoryModel.PATH.GET_BY_ID,
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

  public async getByIdCache(
    id: Category['id'],
    forceRefresh = false,
  ): Promise<Category> {
    if (forceRefresh) {
      this.idToCategoryCache.delete(id);
    }
    const categoryCache = this.idToCategoryCache.get(id);
    if (categoryCache) {
      return categoryCache;
    }

    const category = await this.getById(id);
    this.idToCategoryCache.set(id, category);
    return category;
  }
}
