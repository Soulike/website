import {Category} from '@website/classes';
import {useMemo} from 'react';

import {useCategories} from '@/hooks/useCategories.js';

export type CategoryIdToCategoryMap = Map<string, Category>;

export function useViewModel() {
  const {categories, loading: categoriesIsLoading} = useCategories();

  const idToCategory: CategoryIdToCategoryMap = useMemo(() => {
    const map: CategoryIdToCategoryMap = new Map();
    if (categories !== null) {
      for (const category of categories) {
        map.set(category.id.toString(), category);
      }
    }
    return map;
  }, [categories]);

  return {
    loading: categoriesIsLoading,
    categories,
    idToCategory,
  };
}
