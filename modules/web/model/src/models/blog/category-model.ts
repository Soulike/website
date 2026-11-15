import path from 'node:path';

import {Request} from '@library/request';
import {type Category, CategorySchema} from '@schema/blog';
import {z} from 'zod';

import {prependServerPrefix} from '../path-helper.js';
import {parseServerResponse} from '../response-helper.js';

const CategoryListSchema = z.array(CategorySchema);

class CategoryModel {
  private static readonly PATH = Object.freeze({
    GET_ALL: CategoryModel.prependCategoryPrefix('/getAll'),
    GET_BY_ID: CategoryModel.prependCategoryPrefix('/getById'),
  });
  private allCategoriesCachedPromise: Promise<Category[]> | null = null;
  private idToCategoryCachedPromise = new Map<
    Category['id'],
    Promise<Category>
  >();

  private static prependCategoryPrefix(subPath: string): string {
    return prependServerPrefix(path.join('category', subPath));
  }

  public async getAll(): Promise<Category[]> {
    const response = await Request.JSONToJSON.get<unknown>(
      CategoryModel.PATH.GET_ALL,
    );
    return parseServerResponse(CategoryListSchema, response);
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
    const response = await Request.JSONToJSON.get<unknown>(
      CategoryModel.PATH.GET_BY_ID,
      {
        searchParams: new URLSearchParams({
          json: JSON.stringify({id}),
        }),
      },
    );
    return parseServerResponse(CategorySchema, response);
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
