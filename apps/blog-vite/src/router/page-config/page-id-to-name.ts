import {PAGE_ID, PageIdType} from './page-id.js';

export const PAGE_ID_TO_NAME: Readonly<Record<PageIdType, string>> =
  Object.freeze({
    [PAGE_ID.INDEX]: '首页',
    [PAGE_ID.ARTICLE]: '文章',
    [PAGE_ID.ABOUT]: '关于',
    [PAGE_ID.CATEGORY]: '分类',
  });
