import {usePromise} from '@website/hooks';
import {BlogModels} from '@website/model';
import {useMemo} from 'react';

export function useCategories() {
  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);
  const {pending, resolvedValue, rejectedError} = usePromise(
    categoryModel.getAll(),
  );

  return {
    loading: pending,
    error: rejectedError,
    categories: resolvedValue,
  };
}
