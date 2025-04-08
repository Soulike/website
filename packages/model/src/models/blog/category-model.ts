import path from 'node:path';

import {ModelAccessDeniedError} from '@models/model-access-error.js';
import {prependServerPrefix} from '@models/path-helper.js';
import {Category, ServerResponse} from '@website/classes';
import {Request} from '@website/request';

export class CategoryModel {
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
}
