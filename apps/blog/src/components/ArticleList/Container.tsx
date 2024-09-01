'use client';

import {type Article, type Category} from '@website/classes';
import {useCallback, useMemo, useState} from 'react';

import {useCategories} from '@/src/hooks/useCategories';

import {ArticleListView} from './View';

interface IProps {
  articleList: Article[];
  loading: boolean;
}

export function ArticleList(props: IProps) {
  const [, setPageNumber] = useState(1);
  const {categories, loading: categoriesIsLoading} = useCategories();

  const {articleList, loading} = props;
  const categoryMap: Map<number, Category> = useMemo(() => {
    const map: Map<number, Category> = new Map();
    if (categories !== null) {
      for (const category of categories) {
        map.set(category.id, category);
      }
    }
    return map;
  }, [categories]);

  const onPageNumberChange = useCallback((pageNumber: number) => {
    setPageNumber(pageNumber);
  }, []);

  const isLoading = useMemo(
    () => loading || categoriesIsLoading,
    [categoriesIsLoading, loading],
  );

  return (
    <ArticleListView
      onPageNumberChange={onPageNumberChange}
      articleList={articleList}
      categoryMap={categoryMap}
      loading={isLoading}
    />
  );
}
