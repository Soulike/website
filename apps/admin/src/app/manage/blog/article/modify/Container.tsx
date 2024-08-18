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
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {Blog} from '@/apis';
import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/config/route';

import {ModifyView} from './View';

export function Modify() {
  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(true);
  const [categoryOption, setCategoryOption] = useState<Category[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [isArticlePreviewModalOpen, setIsArticlePreviewModalOpen] =
    useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 查询字符串格式为 ?id=xxx
    const idString = searchParams.get('id');
    if (idString === null) {
      void message.warning('参数不正确');
    } else {
      const id = Number.parseInt(idString);
      if (Number.isNaN(id)) {
        void message.warning('参数不正确');
      } else {
        // 获取文章内容
        setId(id);
        setIsLoadingArticle(true);
        void Blog.Article.getById(id)
          .then((article) => {
            if (article !== null) {
              const {title, content, category, isVisible} = article;
              setTitle(title);
              setContent(content);
              setCategory(category);
              setIsVisible(isVisible);
            }
          })
          .finally(() => {
            setIsLoadingArticle(false);
          });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    setIsLoadingCategory(true);
    void Blog.Category.getAll()
      .then((categoryList) => {
        if (categoryList !== null) {
          setCategoryOption(categoryList);
        }
      })
      .finally(() => {
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
        setIsSubmittingArticle(true);
        const result = await Blog.Article.modify({
          id,
          title,
          content,
          category,
          isVisible,
        });
        setIsSubmittingArticle(false);
        if (result !== null) {
          notification.success({message: '文章修改成功'});
          await router.replace(
            PAGE_ID_TO_ROUTE[PAGE_ID.MANAGE.BLOG.ARTICLE.MANAGE],
          );
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
      categoryOption={categoryOption}
      isLoadingCategory={isLoadingCategory}
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
