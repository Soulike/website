import type {PageIdType} from '@/config/route/page_id.ts';

import {PAGE_ID_TO_ROUTE} from './page_id_to_route.ts';

const routeToPageId: Record<string, PageIdType> = {};

Object.values(PAGE_ID_TO_ROUTE).forEach((pageID) => {
  routeToPageId[PAGE_ID_TO_ROUTE[pageID]] = pageID;
});

export const ROUTE_TO_PAGE_ID = Object.freeze(routeToPageId);
