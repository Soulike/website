import assert from 'node:assert';

import {notification} from 'antd';

import {ArticleEditorProps} from '@/components/ArticleEditor/index.js';
import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {ModifyView} from './view.js';
import {useViewModel} from './view-model.js';

export function Modify() {
  const {
    modifyingArticleId,
    isSubmittingArticleModification,
    handleArticleModificationSubmit,
  } = useViewModel();

  const onSubmitButtonClick: ArticleEditorProps['onSubmitButtonClick'] = ({
    title,
    content,
    category,
    isVisible,
  }) => {
    assert(modifyingArticleId !== null);
    handleArticleModificationSubmit(
      modifyingArticleId,
      title,
      content,
      category,
      isVisible,
      (message: string) => {
        notification.error({title: message});
      },
      () => {
        notification.success({title: 'Article modified'});
      },
      (error) => {
        showErrorNotification(error);
      },
    );
  };

  return modifyingArticleId === null ? null : (
    <ModifyView
      articleId={modifyingArticleId}
      submitting={isSubmittingArticleModification}
      onSubmitButtonClick={onSubmitButtonClick}
    />
  );
}
