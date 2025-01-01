'use client';

import {type Category} from '@website/classes';
import {notification} from 'antd';
import {useEffect, useState} from 'react';

import {Blog} from '@/apis';
import {showNetworkError} from '@/apis/utils';

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
