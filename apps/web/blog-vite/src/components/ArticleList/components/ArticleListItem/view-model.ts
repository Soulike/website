import {Category} from '@module/classes';
import {CategoryModelHooks} from '@module/model/react/blog';

export function useViewModel(categoryId: Category['id']) {
  const {
    category,
    error: categoryLoadError,
    loading: categoryLoading,
  } = CategoryModelHooks.useCategoryByIdCache(categoryId);

  return {
    categoryLoading,
    category,
    categoryLoadError,
  };
}
