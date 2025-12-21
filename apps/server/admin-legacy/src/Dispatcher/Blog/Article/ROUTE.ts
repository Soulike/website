import {prefix as blogPrefix} from '../Function.js';

function prefix(url: string): string {
  return blogPrefix(`/article${url}`);
}

export const GET_BY_ID = prefix('/getById');
export const GET_ALL = prefix('/getAll');
export const GET_BY_CATEGORY = prefix('/getByCategory');
export const ADD = prefix('/add');
export const DELETE_BY_ID = prefix('/deleteById');
export const MODIFY = prefix('/modify');
