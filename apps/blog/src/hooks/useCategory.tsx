import {type Category} from '@website/classes';
import {notification} from 'antd';
import {useEffect, useState} from 'react';

import {Category as CategoryApi} from '@/src/apis';
import {showNetworkError} from '@/src/apis/utils';

export function useCategory(id: number): {
  loading: boolean;
  category: Category | null;
} {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    setCategory(null);
    setLoading(true);
    if (!isNaN(id)) {
      void CategoryApi.getById(id)
        .then((response) => {
          if (response.isSuccessful) {
            const {data: category} = response;
            setCategory(category);
          } else {
            notification.warning({message: response.message});
          }
        })
        .catch((e: unknown) => {
          showNetworkError(e);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  return {loading, category};
}
