import {usePromise} from '@website/hooks';
import {BlogModels} from '@website/model';
import {useMemo} from 'react';

export function useArticleAmountGroupedById() {
  const categoryModel = useMemo(() => new BlogModels.CategoryModel(), []);
  const {pending, resolvedValue, rejectedError} = usePromise(
    categoryModel.getArticleAmountGroupedById(),
  );

  return {
    loading: pending,
    error: rejectedError,
    articleAmountGroupedById: resolvedValue,
  };
}
