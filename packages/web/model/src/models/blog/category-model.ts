import path from 'node:path';

import {ModelAccessDeniedError} from '@models/model-access-error.js';
import {prependServerPrefix} from '@models/path-helper.js';
import {Category, ServerResponse} from '@website/classes';
import {Request} from '@website/request';

class CategoryModel {
  private allCategoriesCachedPromise: Promise<Category[]> | null = null;
  private idToCategoryCachedPromise = new Map<
    Category['id'],
    Promise<Category>
  >();

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
      this.allCategoriesCachedPromise = null;
    }
    this.allCategoriesCachedPromise ??= this.getAll();
    return this.allCategoriesCachedPromise;
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
      this.idToCategoryCachedPromise.delete(id);
    }
    let categoryCache = this.idToCategoryCachedPromise.get(id);
    if (!categoryCache) {
      categoryCache = this.getById(id);
      this.idToCategoryCachedPromise.set(id, categoryCache);
    }

    return categoryCache;
  }
}

export const categoryModel = new CategoryModel();
