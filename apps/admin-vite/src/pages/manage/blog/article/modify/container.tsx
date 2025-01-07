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
import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router';

import {showNetworkError} from '@/helpers/error-notification-helper.js';
import {useCategories} from '@/hooks/useCategories';
import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

import {ModifyView} from './view.js';

export function Modify() {
  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(true);
  const {loading: isLoadingCategories, categories} = useCategories();
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [isArticlePreviewModalOpen, setIsArticlePreviewModalOpen] =
    useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 查询字符串格式为 ?id=xxx
    const idString = searchParams.get('id');
    if (idString === null) {
      void message.warning('Invalid parameters');
    } else {
      const id = Number.parseInt(idString);
      if (Number.isNaN(id)) {
        void message.warning('Invalid parameters');
      } else {
        // 获取文章内容
        setId(id);
        setIsLoadingArticle(true);
        void Blog.Article.getById(id)
          .then((response) => {
            if (response.isSuccessful) {
              const {data: article} = response;
              const {title, content, category, isVisible} = article;
              setTitle(title);
              setContent(content);
              setCategory(category);
              setIsVisible(isVisible);
            } else {
              const {message} = response;
              notification.warning({message});
            }
          })
          .catch((err: unknown) => {
            showNetworkError(err);
          })
          .finally(() => {
            setIsLoadingArticle(false);
          });
      }
    }
  }, [searchParams]);

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
          const response = await Blog.Article.modify({
            id,
            title,
            content,
            category,
            isVisible,
          });
          if (response.isSuccessful) {
            notification.success({message: 'Article modified'});
            await navigate(
              PAGE_ID_TO_PATH[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE],
              {replace: true},
            );
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
    <ModifyView
      title={title}
      content={content}
      category={category}
      categoryOption={categories ?? []}
      isLoadingCategory={isLoadingCategories}
      isLoadingArticle={isLoadingArticle}
      isSubmittingArticle={isSubmittingArticle}
      isVisible={isVisible}
      onArticlePreviewButtonClick={onArticlePreviewButtonClick}
      onArticlePreviewModalOk={onArticlePreviewModalOk}
      onArticlePreviewModalCancel={onArticlePreviewModalCancel}
      isArticlePreviewModalOpen={isArticlePreviewModalOpen}
      onSubmitButtonClick={onSubmitButtonClick}
      onIsVisibleCheckboxChange={onIsVisibleCheckboxChange}
      onCategorySelectorChange={onCategorySelectorChange}
      onContentTextAreaChange={onContentTextAreaChange}
      onTitleInputChange={onTitleInputChange}
    />
  );
}
