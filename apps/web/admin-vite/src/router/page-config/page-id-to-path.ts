import path from 'node:path';

import {PAGE_ID, type PageIdType} from './page-id.js';

const pageIdToPath: Record<PageIdType, string> = {
  [PAGE_ID.INDEX]: '/',
};

pageIdToPath[PAGE_ID.LOGIN] = path.join(pageIdToPath[PAGE_ID.INDEX], 'login');

pageIdToPath[PAGE_ID.MANAGE.INDEX] = path.join(
  pageIdToPath[PAGE_ID.INDEX],
  'manage',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.INDEX] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.INDEX],
  'blog',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.BLOG.INDEX],
  'article',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.ARTICLE.ADD] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX],
  'add',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX],
  'manage',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX],
  'modify',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.BLOG.INDEX],
  'category',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX],
  'add',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX],
  'manage',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.OPTION.INDEX] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.BLOG.INDEX],
  'option',
);

pageIdToPath[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT] = path.join(
  pageIdToPath[PAGE_ID.MANAGE.BLOG.OPTION.INDEX],
  'about',
);

export const PAGE_ID_TO_PATH = Object.freeze(pageIdToPath);
