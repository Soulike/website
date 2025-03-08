import {useModal} from '@website/hooks';
import {useMemo, useState} from 'react';
import ReactDOM from 'react-dom';

import {ArticlePreviewModal, ArticlePreviewModalProps} from './view.js';

export function useArticlePreviewModal() {
  const {show, hide, visible} = useModal();
  const [title, setTitle] = useState<ArticlePreviewModalProps['title']>('');
  const [contentMarkdown, setContentMarkdown] =
    useState<ArticlePreviewModalProps['contentMarkdown']>('');

  const modal = useMemo(
    () =>
      ReactDOM.createPortal(
        <ArticlePreviewModal
          title={title}
          contentMarkdown={contentMarkdown}
          shown={visible}
          onOkButtonClick={hide}
        />,
        document.body,
      ),
    [contentMarkdown, hide, title, visible],
  );

  return {
    modal, // Put this in DOM tree to render the modal
    show,
    hide,
    visible,
    setTitle,
    setContentMarkdown,
  };
}
