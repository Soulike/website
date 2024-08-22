'use client';

import {type ButtonProps, type InputProps, message, notification} from 'antd';
import {useState} from 'react';

import {Blog} from '@/apis';
import {showNetworkError} from '@/apis/utils';

import {AddView} from './View';

export function Add() {
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCategoryNameInputChange: InputProps['onChange'] = (e) => {
    setCategoryName(e.target.value);
  };

  const initAfterSubmit = () => {
    setCategoryName('');
    setIsSubmitting(false);
  };

  const onSubmitButtonClick: ButtonProps['onClick'] = (e) => {
    e.preventDefault();
    const executor = async () => {
      if (categoryName.length === 0) {
        await message.warning('分类名不能为空');
      } else {
        setIsSubmitting(true);
        try {
          const response = await Blog.Category.add({name: categoryName});
          if (response.isSuccessful) {
            notification.success({message: '分类添加成功'});
            initAfterSubmit();
          } else {
            const {message} = response;
            notification.warning({message});
          }
        } catch (e) {
          showNetworkError(e);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
    void executor();
  };

  return (
    <AddView
      categoryName={categoryName}
      onCategoryNameInputChange={onCategoryNameInputChange}
      onSubmitButtonClick={onSubmitButtonClick}
      isSubmitting={isSubmitting}
    />
  );
}
