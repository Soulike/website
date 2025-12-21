import {DATABASE} from '../../CONFIG/index.js';

function prefix(url: string): string {
  return `${DATABASE.ADDRESS}/category${url}`;
}

export const GET = prefix('/get');
export const GET_ALL = prefix('/getAll');
export const ADD = prefix('/add');
export const DELETE_BY_ID = prefix('/deleteById');
export const MODIFY = prefix('/modify');
export const COUNT_ARTICLE_BY_ID = prefix('/countArticleById');
