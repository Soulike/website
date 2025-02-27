import {PAGE_ID_TO_ROUTE} from './page-id-to-route.js';

export const ROUTE_TO_PAGE_ID: Record<string, string> = {};

Object.keys(PAGE_ID_TO_ROUTE).forEach((pageId) => {
  ROUTE_TO_PAGE_ID[PAGE_ID_TO_ROUTE[pageId]] = pageId;
});
