import {useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {useViewModel} from '../common/view-model.js';
import {CategoryMenuMobileView} from './view.js';

export function CategoryMenuMobile() {
  const {categories, categoriesLoading, categoriesLoadError, menuItemLabels} =
    useViewModel();

  useEffect(() => {
    if (!categoriesLoading && categoriesLoadError) {
      showErrorNotification(categoriesLoadError);
    }
  }, [categoriesLoadError, categoriesLoading]);

  return (
    <CategoryMenuMobileView
      loading={categoriesLoading}
      categories={categories ?? []}
      menuItemLabels={menuItemLabels}
    />
  );
}
