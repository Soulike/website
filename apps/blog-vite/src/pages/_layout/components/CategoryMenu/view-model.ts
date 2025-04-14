import {CategoryModelHooks} from '@website/model/react/blog';

export function useViewModel() {
  const {
    categories,
    error: categoriesLoadError,
    loading: categoriesLoading,
  } = CategoryModelHooks.useAllCategoriesCache();

  return {
    categories,
    categoriesLoadError,
    categoriesLoading,
  };
}
