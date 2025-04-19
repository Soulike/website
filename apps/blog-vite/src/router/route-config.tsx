import path from 'node:path';

import {RouteObject} from 'react-router';

import {Index} from '@/pages/_index';
import {RootLayout} from '@/pages/_layout/index.js';
import {About} from '@/pages/about/index.js';

import {PAGE_ID, PAGE_ID_TO_PATH, type PageIdType} from './page-config';

const routeConfig: Record<PageIdType, Readonly<RouteObject>> = {};

routeConfig[PAGE_ID.ARTICLE] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.ARTICLE]),
  element: null,
};

routeConfig[PAGE_ID.ABOUT] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.ABOUT]),
  element: <About />,
};

routeConfig[PAGE_ID.CATEGORY] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.CATEGORY]),
  element: null,
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

export const CONFIG: Readonly<RouteObject>[] = [routeConfig[PAGE_ID.INDEX]];
