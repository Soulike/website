import {categoryModel} from '@models/blog/index.js';
import {Category} from '@website/classes';
import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';
import {useMemo} from 'react';

export const CategoryModelHooks = Object.freeze({
  useAllCategories,
  useCategoryById,
  useAllCategoriesCache,
  useCategoryByIdCache,
});

function useAllCategories(
  onSuccess?: ResolveCallback<Category[]>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(() => categoryModel.getAll(), []);
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    categories: resolvedValue,
  };
}

function useAllCategoriesCache(
  forceRefresh = false,
  onSuccess?: ResolveCallback<Category[]>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(
    () => categoryModel.getAllCache(forceRefresh),
    [forceRefresh],
  );
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    categories: resolvedValue,
  };
}

function useCategoryById(
  id: Category['id'],
  onSuccess?: ResolveCallback<Category>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(() => categoryModel.getById(id), [id]);
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    category: resolvedValue,
  };
}

function useCategoryByIdCache(
  id: Category['id'],
  forceRefresh = false,
  onSuccess?: ResolveCallback<Category>,
  onReject?: RejectCallback,
) {
  const promise = useMemo(
    () => categoryModel.getByIdCache(id, forceRefresh),
    [forceRefresh, id],
  );
  const {pending, resolvedValue, rejectedError} = usePromise(
    promise,
    onSuccess,
    onReject,
  );

  return {
    loading: pending,
    error: rejectedError,
    category: resolvedValue,
  };
}
