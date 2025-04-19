import {useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {useViewModel} from '../common/view-model.js';
import {CategoryMenuView} from './view.js';

export function CategoryMenu() {
  const {categories, categoriesLoading, categoriesLoadError, menuItemLabels} =
    useViewModel();

  useEffect(() => {
    if (!categoriesLoading && categoriesLoadError) {
      showErrorNotification(categoriesLoadError);
    }
  }, [categoriesLoadError, categoriesLoading]);

  return (
    <CategoryMenuView
      loading={categoriesLoading}
      categories={categories ?? []}
      menuItemLabels={menuItemLabels}
    />
  );
}
