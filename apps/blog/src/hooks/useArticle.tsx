import {type Article} from '@website/classes';
import {notification} from 'antd';
import {useEffect, useState} from 'react';

import {Article as ArticleApi} from '@/src/apis';
import {showNetworkError} from '@/src/apis/utils';

export function useArticle(id: number): {
  loading: boolean;
  article: Article | null;
} {
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    setArticle(null);
    setLoading(true);
    if (!isNaN(id)) {
      void ArticleApi.getById(id)
        .then((response) => {
          if (response.isSuccessful) {
            const {data: article} = response;
            setArticle(article);
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

  return {loading, article};
}
