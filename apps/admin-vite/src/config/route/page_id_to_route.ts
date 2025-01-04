import path from 'node:path';

import {PAGE_ID, type PageIdType} from './page_id.ts';

const pageIdToRoute: Record<PageIdType, string> = {
  [PAGE_ID.INDEX]: '/',
};

pageIdToRoute[PAGE_ID.LOGIN] = path.join(pageIdToRoute[PAGE_ID.INDEX], 'login');

pageIdToRoute[PAGE_ID.MANAGE.INDEX] = path.join(
  pageIdToRoute[PAGE_ID.INDEX],
  'manage',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.INDEX] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.INDEX],
  'blog',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.INDEX],
  'article',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX],
  'add',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX],
  'manage',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX],
  'modify',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.INDEX],
  'category',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX],
  'add',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX],
  'manage',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.OPTION.INDEX] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.INDEX],
  'option',
);

pageIdToRoute[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT] = path.join(
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.OPTION.INDEX],
  'about',
);

export const PAGE_ID_TO_ROUTE = Object.freeze(pageIdToRoute);
