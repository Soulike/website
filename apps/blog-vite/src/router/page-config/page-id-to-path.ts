import {PAGE_ID, PageIdType} from './page-id.js';

export const PAGE_ID_TO_PATH: Readonly<Record<PageIdType, string>> = {
  [PAGE_ID.INDEX]: '/',
  [PAGE_ID.ARTICLE]: '/article',
  [PAGE_ID.ABOUT]: '/about',
  [PAGE_ID.CATEGORY]: '/category',
};
