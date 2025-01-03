import path from 'node:path/posix';

import type {RouteObject} from 'react-router';

import {PAGE_ID} from '@/config/route/page_id.ts';
import {PAGE_ID_TO_ROUTE} from '@/config/route/page_id_to_route.ts';
import {PAGE_ID_TO_ROUTE_CONFIG} from '@/config/route/page_id_to_route_config.ts';

export const ROUTE_CONFIG: readonly Readonly<RouteObject>[] = [
  {
    path: PAGE_ID_TO_ROUTE[PAGE_ID.INDEX],
    element: null,
    children: [
      {
        path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.INDEX]),
        element: null,
        children: [
          {
            path: path.basename(PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.INDEX]),
            element: null,
            children: [
              PAGE_ID_TO_ROUTE_CONFIG[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX],
              {
                path: path.basename(
                  PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX],
                ),
                element: null,
                children: [
                  {
                    path: path.basename(
                      PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD],
                    ),
                    element: null,
                  },
                  {
                    path: path.basename(
                      PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE],
                    ),
                    element: null,
                  },
                ],
              },
              {
                path: path.basename(
                  PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.OPTION.INDEX],
                ),
                element: null,
                children: [
                  {
                    path: path.basename(
                      PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT],
                    ),
                    element: null,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
