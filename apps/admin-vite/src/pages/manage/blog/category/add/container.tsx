import {ModelAccessDeniedError} from '@website/model';
import {type ButtonProps, notification} from 'antd';

import {showNetworkError} from '@/helpers/error-notification-helper.js';

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
        notification.error({message});
      },
      () => {
        notification.success({message: 'Category created'});
      },
      (error) => {
        if (error instanceof ModelAccessDeniedError) {
          notification.error({message: error.message});
        } else {
          showNetworkError(error);
        }
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
