import path from 'node:path/posix';

import {PAGE_ID} from './page_id.ts';

const pageIdToRoute: Record<symbol, string> = {
  [PAGE_ID.INDEX]: '/',
  [PAGE_ID.LOGIN]: '/',
  [PAGE_ID.MANAGE.INDEX]: '/manage',
};

{
  // /manage
  pageIdToRoute[PAGE_ID.MANAGE.BLOG.INDEX] = path.join(
    pageIdToRoute[PAGE_ID.MANAGE.INDEX],
    'blog',
  );
  {
    // /manage/blog
    pageIdToRoute[PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX] = path.join(
      pageIdToRoute[PAGE_ID.MANAGE.BLOG.INDEX],
      'article',
    );
    {
      // /manage/blog/article
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
    }

    pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX] = path.join(
      pageIdToRoute[PAGE_ID.MANAGE.BLOG.INDEX],
      'category',
    );
    {
      // /manage/blog/category
      pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.ADD] = path.join(
        pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX],
        'add',
      );
      pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE] = path.join(
        pageIdToRoute[PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX],
        'manage',
      );
    }

    pageIdToRoute[PAGE_ID.MANAGE.BLOG.OPTION.INDEX] = path.join(
      pageIdToRoute[PAGE_ID.MANAGE.BLOG.INDEX],
      'option',
    );
    {
      // /manage/blog/option
      pageIdToRoute[PAGE_ID.MANAGE.BLOG.OPTION.ABOUT] = path.join(
        pageIdToRoute[PAGE_ID.MANAGE.BLOG.OPTION.INDEX],
        'about',
      );
    }
  }
}

export const PAGE_ID_TO_ROUTE = Object.freeze(pageIdToRoute);
