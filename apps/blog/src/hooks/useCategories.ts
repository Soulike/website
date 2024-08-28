import {type Category} from '@website/classes';
import {notification} from 'antd';
import {useEffect, useState} from 'react';

import {Category as CategoryApi} from '@/src/apis';
import {showNetworkError} from '@/src/apis/utils';

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
          notification.warning({message: response.message});
        }
      })
      .catch((e) => {
        showNetworkError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {loading, categories};
}
