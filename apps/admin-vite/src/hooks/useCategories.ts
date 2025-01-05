import {type Category} from '@website/classes';
import {Blog} from '@website/server-api';
import {notification} from 'antd';
import {useEffect, useState} from 'react';

import {showNetworkError} from '@/helpers/error-notification-helper.js';

const {Category: CategoryApi} = Blog;

export function useCategories(): {
  loading: boolean;
  categories: Category[] | null;
} {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setCategories(null);
    void CategoryApi.getAll()
      .then((response) => {
        if (response.isSuccessful) {
          const {data: categories} = response;
          setCategories(categories);
        } else {
          const {message} = response;
          notification.warning({message});
        }
      })
      .catch((e: unknown) => {
        showNetworkError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {loading, categories};
}
