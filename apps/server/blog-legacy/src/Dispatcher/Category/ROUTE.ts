function prefix(url: string): string {
  return `/category${url}`;
}

export const GET_ALL = prefix('/getAll');
export const GET_BY_ID = prefix('/getById');
