import {Blog} from '@website/server-api';
import {
  type ButtonProps,
  type CheckboxProps,
  type InputProps,
  message,
  type ModalProps,
  notification,
  type SelectProps,
} from 'antd';
import {TextAreaProps} from 'antd/lib/input';
import {useState} from 'react';

import {showNetworkError} from '@/helpers/error-notification-helper.js';
import {useCategories} from '@/hooks/useCategories';

import {AddView} from './view.js';

export function Add() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(true);
  const {loading: isLoadingCategories, categories} = useCategories();
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [isArticlePreviewModalOpen, setIsArticlePreviewModalOpen] =
    useState(false);

  const onTitleInputChange: InputProps['onChange'] = (e) => {
    setTitle(e.target.value);
  };

  const onContentTextAreaChange: TextAreaProps['onChange'] = (e) => {
    setContent(e.target.value);
  };

  const onCategorySelectorChange: SelectProps<number>['onChange'] = (value) => {
    setCategory(value); // 在 View 中设置的是 number
  };

  const onIsVisibleCheckboxChange: CheckboxProps['onChange'] = (e) => {
    setIsVisible(e.target.checked);
  };

  const onArticlePreviewButtonClick: ButtonProps['onClick'] = (e) => {
    e.preventDefault();
    setIsArticlePreviewModalOpen(true);
  };

  const onArticlePreviewModalOk: ModalProps['onOk'] = (e) => {
    e.preventDefault();
    setIsArticlePreviewModalOpen(false);
  };

  const onArticlePreviewModalCancel: ModalProps['onCancel'] =
    onArticlePreviewModalOk;

  const initAfterSubmit = () => {
    setTitle('');
    setContent('');
    setCategory(undefined);
    setIsVisible(true);
    setIsSubmittingArticle(false);
  };

  const onSubmitButtonClick: ButtonProps['onClick'] = (e) => {
    e.preventDefault();
    const executor = async () => {
      if (typeof category === 'undefined') {
        await message.warning('No category is selected');
      } else if (title.length === 0) {
        await message.warning('Please input title');
      } else if (content.length === 0) {
        await message.warning('Please input content');
      } else {
        try {
          setIsSubmittingArticle(true);
          const response = await Blog.Article.add({
            title,
            category,
            content,
            isVisible,
          });
          if (response.isSuccessful) {
            notification.success({message: 'Submitted'});
            initAfterSubmit();
          } else {
            const {message} = response;
            notification.warning({message});
          }
        } catch (err) {
          showNetworkError(err);
        } finally {
          setIsSubmittingArticle(false);
        }
      }
    };

    void executor();
  };

  return (
    <AddView
      title={title}
      content={content}
      category={category}
      isVisible={isVisible}
      categoryOption={categories ?? []}
      onTitleInputChange={onTitleInputChange}
      onContentTextAreaChange={onContentTextAreaChange}
      onCategorySelectorChange={onCategorySelectorChange}
      onIsVisibleCheckboxChange={onIsVisibleCheckboxChange}
      onSubmitButtonClick={onSubmitButtonClick}
      isLoadingCategory={isLoadingCategories}
      isSubmittingArticle={isSubmittingArticle}
      isArticlePreviewModalOpen={isArticlePreviewModalOpen}
      onArticlePreviewButtonClick={onArticlePreviewButtonClick}
      onArticlePreviewModalOk={onArticlePreviewModalOk}
      onArticlePreviewModalCancel={onArticlePreviewModalCancel}
    />
  );
}
