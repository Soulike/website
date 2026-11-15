import {CategoryModelHooks} from '@module/model/react/blog';
import {type Category} from '@schema/blog';

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
