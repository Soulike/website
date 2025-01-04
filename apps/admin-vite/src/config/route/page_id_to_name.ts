import {PAGE_ID, type PageIdType} from './page_id.ts';

export const PAGE_ID_TO_NAME: Record<PageIdType, string> = Object.freeze({
  [PAGE_ID.LOGIN]: 'Login',

  [PAGE_ID.MANAGE.INDEX]: 'Website Management',

  [PAGE_ID.MANAGE.BLOG.ARTICLE.ADD]: 'New Article',
  [PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE]: 'Manage Article',
  [PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY]: 'Modify Article',

  [PAGE_ID.MANAGE.BLOG.CATEGORY.ADD]: 'New Category',
  [PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE]: 'Manage Category',

  [PAGE_ID.MANAGE.BLOG.OPTION.ABOUT]: 'About Setting',
});
