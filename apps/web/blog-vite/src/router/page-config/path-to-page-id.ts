import {PageIdType} from './page-id.js';
import {PAGE_ID_TO_PATH} from './page-id-to-path.js';

const pathToPageId: Record<string, PageIdType> = {};

Object.keys(PAGE_ID_TO_PATH).forEach((pageId) => {
  pathToPageId[PAGE_ID_TO_PATH[pageId]] = pageId;
});

export const PATH_TO_PAGE_ID: Readonly<Record<string, PageIdType>> =
  Object.freeze(pathToPageId);
