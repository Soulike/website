import {CategoryModelHooks} from '@module/model/react/blog';

import {STRING_KEY, useI18nString} from '@/i18n/index.js';

import type {MenuItemLabels} from './menu-helpers.js';

export function useViewModel() {
  const {
    categories,
    error: categoriesLoadError,
    loading: categoriesLoading,
  } = CategoryModelHooks.useAllCategoriesCache();

  const menuItemLabels = useMenuItemLabels();

  return {
    categories,
    categoriesLoadError,
    categoriesLoading,
    menuItemLabels,
  };
}

function useMenuItemLabels(): MenuItemLabels {
  const indexLabel = useI18nString(STRING_KEY.UI_LABEL_INDEX);
  const categoryLabel = useI18nString(STRING_KEY.UI_LABEL_CATEGORY);
  const aboutLabel = useI18nString(STRING_KEY.UI_LABEL_ABOUT);

  return {
    index: indexLabel,
    category: categoryLabel,
    about: aboutLabel,
  };
}
