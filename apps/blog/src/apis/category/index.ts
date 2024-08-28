import {type Category, ServerResponse} from '@website/classes';
import {Request} from '@website/request';

import {GET_ALL, GET_BY_ID} from './ROUTE';

export async function getAll(): Promise<ServerResponse<Category[]>> {
  return Request.JSONToJSON.get(GET_ALL);
}

export async function getById(id: number): Promise<ServerResponse<Category>> {
  return Request.JSONToJSON.get(GET_BY_ID, {
    searchParams: new URLSearchParams({
      json: JSON.stringify({id}),
    }),
  });
}
