import path from 'node:path';

import {RouteObject} from 'react-router';

import {NotFound} from '@/components/NotFound/index.js';
import {Index} from '@/pages/_index/index.js';
import {RootLayout} from '@/pages/_layout/index.js';
import {About} from '@/pages/about/index.js';
import {Article} from '@/pages/article/index.js';
import {Category} from '@/pages/category/index.js';

import {
  ARTICLE_PATH_PARAM_NAME_ID,
  CATEGORY_PATH_PARAM_NAME_ID,
  PAGE_ID,
  PAGE_ID_TO_PATH,
  type PageIdType,
} from './page-config/index.js';

const routeConfig: Record<PageIdType, Readonly<RouteObject>> = {};

routeConfig[PAGE_ID.ARTICLE] = {
  path: path.join(
    path.basename(PAGE_ID_TO_PATH[PAGE_ID.ARTICLE]),
    `:${ARTICLE_PATH_PARAM_NAME_ID}`,
  ),
  element: <Article />,
};

routeConfig[PAGE_ID.ABOUT] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.ABOUT]),
  element: <About />,
};

routeConfig[PAGE_ID.CATEGORY] = {
  path: path.join(
    path.basename(PAGE_ID_TO_PATH[PAGE_ID.CATEGORY]),
    `:${CATEGORY_PATH_PARAM_NAME_ID}`,
  ),
  element: <Category />,
};

routeConfig[PAGE_ID.INDEX] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.INDEX]),
  element: <RootLayout />,
  children: [
    {
      index: true,
      element: <Index />,
    },
    routeConfig[PAGE_ID.ARTICLE],
    routeConfig[PAGE_ID.CATEGORY],
    routeConfig[PAGE_ID.ABOUT],
  ],
};

export const CONFIG: Readonly<RouteObject>[] = [
  routeConfig[PAGE_ID.INDEX],
  {
    path: '*',
    element: <NotFound />,
  },
];
