function prefix(route: string) {
  return `/article${route}`;
}

export const ADD = prefix('/add');
export const DELETE_BY_ID = prefix('/deleteById');
export const MODIFY = prefix('/modify');
export const GET = prefix('/get');
export const GET_ALL = prefix('/getAll');
export const GET_BY_DATE = prefix('/getByDate');
export const COUNT = prefix('/count');
export const COUNT_ALL = prefix('/countAll');
export const ADD_PAGE_VIEW = prefix('/addPageView');
