import {DATABASE} from '../../CONFIG/index.js';

function prefix(url: string): string {
  return `${DATABASE.ADDRESS}/user${url}`;
}

export const ADD = prefix('/add');

export const GET = prefix('/get');

export const MODIFY = prefix('/modify');
