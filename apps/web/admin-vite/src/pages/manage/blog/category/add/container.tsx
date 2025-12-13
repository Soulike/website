import {type ButtonProps, notification} from 'antd';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {AddView} from './view.js';
import {useViewModel} from './view-model.js';

export function Add() {
  const {
    categoryName,
    onCategoryNameInputChange,
    newCategorySubmitting,
    handleNewCategorySubmit,
  } = useViewModel();

  const onSubmitButtonClick: ButtonProps['onClick'] = (e) => {
    e.preventDefault();
    handleNewCategorySubmit(
      categoryName,
      (message) => {
        notification.error({title: message});
      },
      () => {
        notification.success({title: 'Category created'});
      },
      (error) => {
        showErrorNotification(error);
      },
    );
  };

  return (
    <AddView
      categoryName={categoryName}
      onCategoryNameInputChange={onCategoryNameInputChange}
      onSubmitButtonClick={onSubmitButtonClick}
      isSubmitting={newCategorySubmitting}
    />
  );
}
