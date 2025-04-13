import {CategoryModelHooks} from '@website/model/react/blog';

export function useViewModel() {
  const {
    categories,
    error: categoriesLoadError,
    loading: categoriesLoading,
  } = CategoryModelHooks.useAllCategories();

  return {
    categories,
    categoriesLoadError,
    categoriesLoading,
  };
}
