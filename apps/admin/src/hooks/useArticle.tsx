import {type Article} from '@website/classes';
import {useEffect, useState} from 'react';

import {Blog} from '@/apis';

const {Article: ArticleApi} = Blog;

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
        .then((article) => {
          setArticle(article);
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
