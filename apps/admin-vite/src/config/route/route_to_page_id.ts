import {PAGE_ID_TO_ROUTE} from './page_id_to_route.ts';

const routeToPageId: Record<string, symbol> = {};

Object.getOwnPropertySymbols(PAGE_ID_TO_ROUTE).forEach((pageID) => {
  routeToPageId[PAGE_ID_TO_ROUTE[pageID]] = pageID;
});

export const ROUTE_TO_PAGE_ID = Object.freeze(routeToPageId);
