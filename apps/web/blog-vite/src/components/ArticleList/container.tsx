import {type Article} from '@schema/blog';
import type {PaginationProps} from 'antd';
import {useCallback, useMemo, useRef, useState} from 'react';

import {ArticleListView} from './view.js';

const PAGE_SIZE = 10;

interface IProps {
  // TODO: Make ArticleList accept a list of article ids instead of all articles
  articles: Article[];
  loading: boolean;
}

export function ArticleList(props: IProps) {
  const {articles, loading} = props;
  const viewRef = useRef<HTMLDivElement>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onPageNumberChange: NonNullable<PaginationProps['onChange']> =
    useCallback((nextPageNumber: number) => {
      setPageNumber(nextPageNumber);
      if (!viewRef.current) {
        return;
      }

      viewRef.current.scrollIntoView(true);
    }, []);

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const effectivePageNumber = Math.min(pageNumber, totalPages);
  const paginatedArticles = useMemo(() => {
    const startIndex = (effectivePageNumber - 1) * PAGE_SIZE;
    return articles.slice(startIndex, startIndex + PAGE_SIZE);
  }, [articles, effectivePageNumber]);

  return (
    <ArticleListView
      viewRef={viewRef}
      currentPage={effectivePageNumber}
      pageSize={PAGE_SIZE}
      totalArticles={articles.length}
      onPageNumberChange={onPageNumberChange}
      articleList={paginatedArticles}
      loading={loading}
    />
  );
}
