'use client';

import {type Article, type Category} from '@website/classes';
import {useMathJax} from '@website/hooks';
import type {PaginationConfig} from 'antd/lib/pagination';
import {useCallback, useMemo, useRef, useState} from 'react';

import {useCategories} from '@/src/hooks/useCategories';

import {ArticleListView} from './View';

interface IProps {
  articleList: Article[];
  loading: boolean;
}

export function ArticleList(props: IProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [pageNumber, setPageNumber] = useState(1);
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

  const onPageNumberChange: PaginationConfig['onChange'] = useCallback(
    (pageNumber: number) => {
      setPageNumber(pageNumber);
      if (!viewRef.current) {
        return;
      }

      viewRef.current.scrollIntoView(true);
    },
    [],
  );

  // TODO: bug: math render when page changes
  const {loading: mathJaxLoading} = useMathJax([
    articleList,
    categoryMap,
    pageNumber,
  ]);

  const isLoading = useMemo(
    () => loading || categoriesIsLoading || mathJaxLoading,
    [categoriesIsLoading, loading, mathJaxLoading],
  );

  return (
    <ArticleListView
      viewRef={viewRef}
      onPageNumberChange={onPageNumberChange}
      articleList={articleList}
      categoryMap={categoryMap}
      loading={isLoading}
    />
  );
}
