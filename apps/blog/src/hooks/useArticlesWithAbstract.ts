import {type Article} from '@website/classes';
import {notification} from 'antd';
import {useEffect, useState} from 'react';

import {Article as ArticleApi} from '@/src/apis';
import {showNetworkError} from '@/src/apis/utils';

export function useArticlesWithAbstract(categoryId?: number): {
  loading: boolean;
  articlesWithAbstract: Article[] | null;
} {
  const [articlesWithAbstract, setArticlesWithAbstract] = useState<
    Article[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setArticlesWithAbstract(null);

    if (categoryId !== undefined && isNaN(categoryId)) {
      setLoading(false);
      return;
    }

    const promise =
      categoryId === undefined
        ? ArticleApi.getAllWithAbstract()
        : ArticleApi.getByCategoryWithAbstract(categoryId);

    void promise
      .then((response) => {
        if (response.isSuccessful) {
          const {data: articlesWithAbstract} = response;
          setArticlesWithAbstract(articlesWithAbstract);
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
  }, [categoryId]);

  return {loading, articlesWithAbstract};
}
