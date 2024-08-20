'use client';

import {type Category} from '@website/classes';
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
import {useEffect, useState} from 'react';

import {Blog} from '@/apis';
import {showNetworkError} from '@/apis/utils';

import {AddView} from './View';

export function Add() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(true);
  const [categoryOption, setCategoryOption] = useState<Category[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [isArticlePreviewModalOpen, setIsArticlePreviewModalOpen] =
    useState(false);

  useEffect(() => {
    const getCategoryOption = async () => {
      const category = await Blog.Category.getAll();
      if (category !== null) {
        setCategoryOption(category);
      }
    };

    setIsLoadingCategory(true);
    void getCategoryOption().finally(() => {
      setIsLoadingCategory(false);
    });
  }, []);

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
    setIsLoadingCategory(false);
    setIsSubmittingArticle(false);
  };

  const onSubmitButtonClick: ButtonProps['onClick'] = (e) => {
    e.preventDefault();
    const executor = async () => {
      if (typeof category === 'undefined') {
        await message.warning('请选择文章分类');
      } else if (title.length === 0) {
        await message.warning('请填写文章标题');
      } else if (content.length === 0) {
        await message.warning('请填写文章内容');
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
            notification.success({message: '文章提交成功'});
            initAfterSubmit();
          } else {
            const {message} = response;
            notification.warning({message});
          }
        } catch (err) {
          await showNetworkError(err);
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
      categoryOption={categoryOption}
      onTitleInputChange={onTitleInputChange}
      onContentTextAreaChange={onContentTextAreaChange}
      onCategorySelectorChange={onCategorySelectorChange}
      onIsVisibleCheckboxChange={onIsVisibleCheckboxChange}
      onSubmitButtonClick={onSubmitButtonClick}
      isLoadingCategory={isLoadingCategory}
      isSubmittingArticle={isSubmittingArticle}
      isArticlePreviewModalOpen={isArticlePreviewModalOpen}
      onArticlePreviewButtonClick={onArticlePreviewButtonClick}
      onArticlePreviewModalOk={onArticlePreviewModalOk}
      onArticlePreviewModalCancel={onArticlePreviewModalCancel}
    />
  );
}
