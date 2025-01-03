import path from 'node:path/posix';

import type {RouteObject} from 'react-router';

import {PAGE_ID} from '@/config/route/page_id.ts';
import {PAGE_ID_TO_ROUTE} from '@/config/route/page_id_to_route.ts';

const pageIdToRouteConfig: Record<symbol, Readonly<RouteObject>> = {};

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD]),
  element: null,
};

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE]),
  element: null,
};

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]),
  element: null,
};

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX]),
  element: null,
  children: [
    pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD],
    pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE],
    pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY],
  ],
};

export const PAGE_ID_TO_ROUTE_CONFIG: Readonly<typeof pageIdToRouteConfig> =
  pageIdToRouteConfig;
