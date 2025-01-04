import path from 'node:path';

import {ErrorBoundary} from '@website/react-components';
import {Suspense} from 'react';
import {Outlet, RouteObject} from 'react-router';

import {Loading} from '@/components/loading';
import {NotFound} from '@/components/not-found';
import {PAGE_ID, type PageIdType} from '@/config/route/page_id.ts';
import {PAGE_ID_TO_ROUTE} from '@/config/route/page_id_to_route.ts';
import {Login} from '@/pages/login';
import {Layout as ManageLayout} from '@/pages/manage/_layout';

const pageIdToRouteConfig: Record<PageIdType, Readonly<RouteObject>> = {};

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

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD]),
  element: null,
};

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE]),
  element: null,
};

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX]),
  element: null,
  children: [
    pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD],
    pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE],
  ],
};

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]),
  element: null,
};

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.OPTION.INDEX] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.OPTION.INDEX]),
  element: null,
  children: [pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]],
};

pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.INDEX] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.INDEX]),
  element: null,
  children: [
    pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX],
    pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX],
    pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.OPTION.INDEX],
  ],
};

pageIdToRouteConfig[PAGE_ID.MANAGE.INDEX] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.INDEX]),
  element: (
    <ErrorBoundary fallback={<NotFound />}>
      <Suspense fallback={<Loading />}>
        <ManageLayout />
      </Suspense>
    </ErrorBoundary>
  ),
  children: [pageIdToRouteConfig[PAGE_ID.MANAGE.BLOG.INDEX]],
};

pageIdToRouteConfig[PAGE_ID.LOGIN] = {
  path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.LOGIN]),
  element: <Login />,
};

pageIdToRouteConfig[PAGE_ID.INDEX] = {
  path: PAGE_ID_TO_ROUTE[PAGE_ID.INDEX],
  element: (
    <ErrorBoundary fallback={<NotFound />}>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  ),
  children: [
    {
      index: true,
      element: pageIdToRouteConfig[PAGE_ID.LOGIN].element,
    },
    pageIdToRouteConfig[PAGE_ID.LOGIN],
    pageIdToRouteConfig[PAGE_ID.MANAGE.INDEX],
  ],
};

export const CONFIG: Readonly<RouteObject>[] = [
  pageIdToRouteConfig[PAGE_ID.INDEX],
];
