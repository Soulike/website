import path from 'node:path';

import {Request} from '@library/request';
import {
  type Category,
  type CategoryDraft,
  type CategoryIdToArticleAmount,
  CategoryIdToArticleAmountSchema,
  CategorySchema,
  type UpdateCategory,
} from '@schema/blog';
import {z} from 'zod';

import {
  parseServerResponse,
  parseVoidServerResponse,
} from '../../response-helper.js';
import {prependBlogPrefix} from './path-helper.js';

const CategoryListSchema = z.array(CategorySchema);
const ArticleAmountSchema = z.number().int().nonnegative();

export class CategoryModel {
  private static readonly PATH = Object.freeze({
    GET_ALL: CategoryModel.prependCategoryPrefix('/getAll'),
    // TODO: Review the name of the API. `getArticleAmountGroupedById` should be better.
    GET_ALL_ARTICLE_AMOUNT_BY_ID: CategoryModel.prependCategoryPrefix(
      '/getAllArticleAmountById',
    ),
    GET_ARTICLE_AMOUNT_BY_ID: CategoryModel.prependCategoryPrefix(
      '/getArticleAmountById',
    ),
    ADD: CategoryModel.prependCategoryPrefix('/add'),
    GET_BY_ID: CategoryModel.prependCategoryPrefix('/getById'),
    DELETE_BY_ID: CategoryModel.prependCategoryPrefix('/deleteById'),
    MODIFY: CategoryModel.prependCategoryPrefix('/modify'),
  });

  private static prependCategoryPrefix(subPath: string): string {
    return prependBlogPrefix(path.join('category', subPath));
  }

  public async getAll(): Promise<Category[]> {
    const response = await Request.JSONToJSON.get<unknown>(
      CategoryModel.PATH.GET_ALL,
    );
    return parseServerResponse(CategoryListSchema, response);
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

  public async getArticleAmountGroupedById(): Promise<CategoryIdToArticleAmount> {
    const response = await Request.JSONToJSON.get<unknown>(
      CategoryModel.PATH.GET_ALL_ARTICLE_AMOUNT_BY_ID,
    );
    return parseServerResponse(CategoryIdToArticleAmountSchema, response);
  }

  public async getArticleAmountById(id: Category['id']): Promise<number> {
    const response = await Request.JSONToJSON.get<unknown>(
      CategoryModel.PATH.GET_ARTICLE_AMOUNT_BY_ID,
      {
        searchParams: new URLSearchParams({
          json: JSON.stringify({id}),
        }),
      },
    );
    return parseServerResponse(ArticleAmountSchema, response);
  }

  public async add(category: CategoryDraft): Promise<void> {
    const response = await Request.JSONToJSON.post<unknown>(
      CategoryModel.PATH.ADD,
      {
        body: category,
      },
    );
    parseVoidServerResponse(response);
  }

  public async deleteById(id: Category['id']): Promise<void> {
    const response = await Request.JSONToJSON.post<unknown>(
      CategoryModel.PATH.DELETE_BY_ID,
      {
        body: {id},
      },
    );
    parseVoidServerResponse(response);
  }

  public async modify(
    id: UpdateCategory['id'],
    modifiedParts: Omit<UpdateCategory, 'id'>,
  ): Promise<void> {
    const response = await Request.JSONToJSON.post<unknown>(
      CategoryModel.PATH.MODIFY,
      {
        body: {id, ...modifiedParts},
      },
    );
    parseVoidServerResponse(response);
  }
}
