import {notification} from 'antd';

import {ArticleEditorProps} from '@/components/ArticleEditor/index.js';
import {showErrorNotification} from '@/helpers/error-notification-helper.js';

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
        notification.error({title: message});
      },
      () => {
        notification.success({title: 'Submitted'});
      },
      (error) => {
        showErrorNotification(error);
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
