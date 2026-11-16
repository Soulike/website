import {PAGE_ID, type PageIdType} from './page-id.js';
import {PAGE_ID_TO_PATH} from './page-id-to-path.js';

const ALL_PAGE_IDS: readonly PageIdType[] = [
  PAGE_ID.INDEX,
  PAGE_ID.LOGIN,
  PAGE_ID.MANAGE.INDEX,
  PAGE_ID.MANAGE.BLOG.INDEX,
  PAGE_ID.MANAGE.BLOG.ARTICLE.INDEX,
  PAGE_ID.MANAGE.BLOG.ARTICLE.ADD,
  PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE,
  PAGE_ID.MANAGE.BLOG.ARTICLE.MODIFY,
  PAGE_ID.MANAGE.BLOG.CATEGORY.INDEX,
  PAGE_ID.MANAGE.BLOG.CATEGORY.ADD,
  PAGE_ID.MANAGE.BLOG.CATEGORY.MANAGE,
  PAGE_ID.MANAGE.BLOG.OPTION.INDEX,
  PAGE_ID.MANAGE.BLOG.OPTION.ABOUT,
];

const pathToPageId: Record<string, PageIdType> = {};

for (const pageId of ALL_PAGE_IDS) {
  pathToPageId[PAGE_ID_TO_PATH[pageId]] = pageId;
}

export const PATH_TO_PAGE_ID: Readonly<Record<string, PageIdType>> =
  Object.freeze(pathToPageId);
