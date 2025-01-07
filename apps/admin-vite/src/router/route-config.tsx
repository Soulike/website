import path from 'node:path';

import {ErrorBoundary} from '@website/react-components';
import {Suspense} from 'react';
import {Outlet, RouteObject} from 'react-router';

import {Loading} from '@/components/Loading';
import {NotFound} from '@/components/NotFound';
import {Index} from '@/pages/_index';
import {Login} from '@/pages/login';
import {Index as ManageIndex} from '@/pages/manage/_index';
import {Layout as ManageLayout} from '@/pages/manage/_layout';
import {Index as ManageBlogIndex} from '@/pages/manage/blog/_index';
import {Layout as ManageBlogLayout} from '@/pages/manage/blog/_layout';
import {Add as ManageBlogArticleAdd} from '@/pages/manage/blog/article/add';
import {Manage as ManageBlogArticleManage} from '@/pages/manage/blog/article/manage';
import {Modify as ManageBlogArticleModify} from '@/pages/manage/blog/article/modify';
import {About as ManageBlogOptionAbout} from '@/pages/manage/blog/option/about';

import {PAGE_ID, PAGE_ID_TO_PATH, type PageIdType} from './page-config';

const routeConfig: Record<PageIdType, Readonly<RouteObject>> = {};

routeConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD]),
  element: <ManageBlogArticleAdd />,
};

routeConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE]),
  element: <ManageBlogArticleManage />,
};

routeConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]),
  element: <ManageBlogArticleModify />,
};

routeConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX]),
  element: null,
  children: [
    routeConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD],
    routeConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE],
    routeConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY],
  ],
};

routeConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD]),
  element: null,
};

routeConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE]),
  element: null,
};

routeConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX]),
  element: null,
  children: [
    routeConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD],
    routeConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE],
  ],
};

routeConfig[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]),
  element: <ManageBlogOptionAbout />,
};

routeConfig[PAGE_ID.MANAGE.BLOG.OPTION.INDEX] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.OPTION.INDEX]),
  element: null,
  children: [routeConfig[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]],
};

routeConfig[PAGE_ID.MANAGE.BLOG.INDEX] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.INDEX]),
  element: (
    <ErrorBoundary fallback={<NotFound />}>
      <Suspense fallback={<Loading />}>
        <ManageBlogLayout />
      </Suspense>
    </ErrorBoundary>
  ),
  children: [
    {
      index: true,
      element: <ManageBlogIndex />,
    },
    routeConfig[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX],
    routeConfig[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX],
    routeConfig[PAGE_ID.MANAGE.BLOG.OPTION.INDEX],
  ],
};

routeConfig[PAGE_ID.MANAGE.INDEX] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.INDEX]),
  element: (
    <ErrorBoundary fallback={<NotFound />}>
      <Suspense fallback={<Loading />}>
        <ManageLayout />
      </Suspense>
    </ErrorBoundary>
  ),
  children: [
    {
      index: true,
      element: <ManageIndex />,
    },
    routeConfig[PAGE_ID.MANAGE.BLOG.INDEX],
  ],
};

routeConfig[PAGE_ID.LOGIN] = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.LOGIN]),
  element: <Login />,
};

routeConfig[PAGE_ID.INDEX] = {
  path: PAGE_ID_TO_PATH[PAGE_ID.INDEX],
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
      element: <Index />,
    },
    routeConfig[PAGE_ID.LOGIN],
    routeConfig[PAGE_ID.MANAGE.INDEX],
  ],
};

export const CONFIG: Readonly<RouteObject>[] = [routeConfig[PAGE_ID.INDEX]];
