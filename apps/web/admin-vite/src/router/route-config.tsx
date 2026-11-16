import path from 'node:path';

import {ErrorBoundary} from '@library/react-components';
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
import {Add as ManageBlogCategoryAdd} from '@/pages/manage/blog/category/add';
import {Manage as ManageBlogCategoryManage} from '@/pages/manage/blog/category/manage';
import {About as ManageBlogOptionAbout} from '@/pages/manage/blog/option/about';

import {PAGE_ID, PAGE_ID_TO_PATH} from './page-config';

const manageBlogArticleRoute: Readonly<RouteObject> = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX]),
  element: null,
  children: [
    {
      path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD]),
      element: <ManageBlogArticleAdd />,
    },
    {
      path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE]),
      element: <ManageBlogArticleManage />,
    },
    {
      path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]),
      element: <ManageBlogArticleModify />,
    },
  ],
};

const manageBlogCategoryRoute: Readonly<RouteObject> = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX]),
  element: null,
  children: [
    {
      path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD]),
      element: <ManageBlogCategoryAdd />,
    },
    {
      path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE]),
      element: <ManageBlogCategoryManage />,
    },
  ],
};

const manageBlogOptionRoute: Readonly<RouteObject> = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.OPTION.INDEX]),
  element: null,
  children: [
    {
      path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]),
      element: <ManageBlogOptionAbout />,
    },
  ],
};

const manageBlogRoute: Readonly<RouteObject> = {
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
    manageBlogArticleRoute,
    manageBlogCategoryRoute,
    manageBlogOptionRoute,
  ],
};

const manageRoute: Readonly<RouteObject> = {
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
    manageBlogRoute,
  ],
};

const loginRoute: Readonly<RouteObject> = {
  path: path.basename(PAGE_ID_TO_PATH[PAGE_ID.LOGIN]),
  element: <Login />,
};

const indexRoute: Readonly<RouteObject> = {
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
    loginRoute,
    manageRoute,
  ],
};

export const CONFIG: Readonly<RouteObject>[] = [indexRoute];
