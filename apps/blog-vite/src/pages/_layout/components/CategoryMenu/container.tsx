import {useEffect} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {CategoryMenuView} from './view.js';
import {useViewModel} from './view-model.js';

export interface ICategoryMenuViewProps {
  isMobile: boolean;
}

export function CategoryMenu({isMobile}: ICategoryMenuViewProps) {
  // TODO: Cache all categories globally
  const {categories, categoriesLoading, categoriesLoadError} = useViewModel();

  useEffect(() => {
    if (!categoriesLoading && categoriesLoadError) {
      showErrorNotification(categoriesLoadError);
    }
  }, [categoriesLoadError, categoriesLoading]);

  return (
    <CategoryMenuView
      loading={categoriesLoading}
      categories={categories ?? []}
      isMobile={isMobile}
    />
  );
}
