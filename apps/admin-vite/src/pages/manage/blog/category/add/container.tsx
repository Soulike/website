import {Blog} from '@website/server-api';
import {type ButtonProps, type InputProps, message, notification} from 'antd';
import {useState} from 'react';

import {showNetworkError} from '@/helpers/error-notification-helper.js';

import {AddView} from './view.js';

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
        await message.warning('Please input category');
      } else {
        setIsSubmitting(true);
        try {
          const response = await Blog.Category.add({name: categoryName});
          if (response.isSuccessful) {
            notification.success({message: 'Category added'});
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
