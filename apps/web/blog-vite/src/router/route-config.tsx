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
} from './page-config/index.js';

const articleRoute: Readonly<RouteObject> = {
  path: path.join(
    path.basename(PAGE_ID_TO_PATH[PAGE_ID.ARTICLE]),
    `:${ARTICLE_PATH_PARAM_NAME_ID}`,
  ),
  element: <Article />,
};

const aboutRoute: Readonly<RouteObject> = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.ABOUT]),
  element: <About />,
};

const categoryRoute: Readonly<RouteObject> = {
  path: path.join(
    path.basename(PAGE_ID_TO_PATH[PAGE_ID.CATEGORY]),
    `:${CATEGORY_PATH_PARAM_NAME_ID}`,
  ),
  element: <Category />,
};

const indexRoute: Readonly<RouteObject> = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.INDEX]),
  element: <RootLayout />,
  children: [
    {
      index: true,
      element: <Index />,
    },
    articleRoute,
    categoryRoute,
    aboutRoute,
  ],
};

export const CONFIG: Readonly<RouteObject>[] = [
  indexRoute,
  {
    path: '*',
    element: <NotFound />,
  },
];
