import path from 'node:path';

import {RouteObject} from 'react-router';

import {PAGE_ID, PAGE_ID_TO_PATH, type PageIdType} from './page-config';

const routeConfig: Record<PageIdType, Readonly<RouteObject>> = {};

routeConfig[PAGE_ID.INDEX] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.INDEX]),
  element: null,
};

routeConfig[PAGE_ID.ARTICLE] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.ARTICLE]),
  element: null,
};

routeConfig[PAGE_ID.ABOUT] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.ABOUT]),
  element: null,
};

routeConfig[PAGE_ID.CATEGORY] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.CATEGORY]),
  element: null,
};

export const CONFIG: Readonly<RouteObject>[] = [routeConfig[PAGE_ID.INDEX]];
