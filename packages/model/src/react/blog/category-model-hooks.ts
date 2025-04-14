import {CategoryModel} from '@models/blog/category-model.js';
import {Category} from '@website/classes';
import {RejectCallback, ResolveCallback, usePromise} from '@website/hooks';
import {useMemo} from 'react';

const categoryModel = new CategoryModel();

export const CategoryModelHooks = Object.freeze({
  useAllCategories,
  useCategoryById,
  useAllCategoriesCache,
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
