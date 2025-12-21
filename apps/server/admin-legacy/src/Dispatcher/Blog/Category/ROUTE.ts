import {prefix as blogPrefix} from '../Function.js';

function prefix(url: string): string {
  return blogPrefix(`/category${url}`);
}

export const GET_BY_ID = prefix('/getById');
export const GET_ALL = prefix('/getAll');
export const GET_ALL_ARTICLE_AMOUNT_BY_ID = prefix('/getAllArticleAmountById');
export const GET_ARTICLE_AMOUNT_BY_ID = prefix('/getArticleAmountById');
export const ADD = prefix('/add');
export const DELETE_BY_ID = prefix('/deleteById');
export const MODIFY = prefix('/modify');
