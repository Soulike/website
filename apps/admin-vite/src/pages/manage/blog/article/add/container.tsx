import {ModelAccessDeniedError} from '@website/model';
import {notification} from 'antd';

import {ArticleEditorProps} from '@/components/ArticleEditor/index.js';
import {showNetworkError} from '@/helpers/error-notification-helper.js';

import {AddView} from './view.js';
import {useViewModel} from './view-model.js';

export function Add() {
  const {handleArticleSubmit, isSubmittingArticle} = useViewModel();

  const onSubmitButtonClick: ArticleEditorProps['onSubmitButtonClick'] = ({
    title,
    content,
    category,
    isVisible,
  }) => {
    handleArticleSubmit(
      title,
      content,
      category,
      isVisible,
      (message) => {
        notification.error({message});
      },
      () => {
        notification.success({message: 'Submitted'});
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
      submitting={isSubmittingArticle}
      onSubmitButtonClick={onSubmitButtonClick}
    />
  );
}
