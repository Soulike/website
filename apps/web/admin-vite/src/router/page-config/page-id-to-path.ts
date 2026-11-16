import path from 'node:path';

import {PAGE_ID, type PageIdType} from './page-id.js';

const indexPath = '/';
const loginPath = path.join(indexPath, 'login');
const manageIndexPath = path.join(indexPath, 'manage');
const manageBlogIndexPath = path.join(manageIndexPath, 'blog');
const manageBlogArticleIndexPath = path.join(manageBlogIndexPath, 'article');
const manageBlogCategoryIndexPath = path.join(manageBlogIndexPath, 'category');
const manageBlogOptionIndexPath = path.join(manageBlogIndexPath, 'option');

export const PAGE_ID_TO_PATH: Readonly<Record<PageIdType, string>> =
  Object.freeze({
    [PAGE_ID.INDEX]: indexPath,
    [PAGE_ID.LOGIN]: loginPath,
    [PAGE_ID.MANAGE.INDEX]: manageIndexPath,
    [PAGE_ID.MANAGE.BLOG.INDEX]: manageBlogIndexPath,
    [PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX]: manageBlogArticleIndexPath,
    [PAGE_ID.MANAGE.BLOG.ARTICLE.ADD]: path.join(
      manageBlogArticleIndexPath,
      'add',
    ),
    [PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE]: path.join(
      manageBlogArticleIndexPath,
      'manage',
    ),
    [PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]: path.join(
      manageBlogArticleIndexPath,
      'modify',
    ),
    [PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX]: manageBlogCategoryIndexPath,
    [PAGE_ID.MANAGE.BLOG.CATEGORY.ADD]: path.join(
      manageBlogCategoryIndexPath,
      'add',
    ),
    [PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE]: path.join(
      manageBlogCategoryIndexPath,
      'manage',
    ),
    [PAGE_ID.MANAGE.BLOG.OPTION.INDEX]: manageBlogOptionIndexPath,
    [PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]: path.join(
      manageBlogOptionIndexPath,
      'about',
    ),
  });
