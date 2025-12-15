function prefix(route: string) {
  return `/user${route}`;
}

export const ADD = prefix('/add');
export const GET = prefix('/get');
export const MODIFY = prefix('/modify');
