import {Category} from '@website/classes';
import {CategoryModelHooks} from '@website/model/react/blog';

export function useViewModel(categoryId: Category['id']) {
  const {
    category,
    error: categoryLoadError,
    loading: categoryLoading,
  } = CategoryModelHooks.useCategoryById(categoryId);

  return {
    categoryLoading,
    category,
    categoryLoadError,
  };
}
