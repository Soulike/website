function prefix(url: string): string {
  return `/article${url}`;
}

export const GET_ALL_WITH_ABSTRACT = prefix('/getAllWithAbstract');
export const GET_BY_ID = prefix('/getById');
export const GET_BY_CATEGORY_WITH_ABSTRACT = prefix(
  '/getByCategoryWithAbstract',
);
