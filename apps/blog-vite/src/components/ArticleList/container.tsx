import {type Article} from '@website/classes';
import type {PaginationConfig} from 'antd/lib/pagination';
import {useCallback, useRef, useState} from 'react';

import {ArticleListView} from './view.js';

interface IProps {
  articles: Article[];
  loading: boolean;
}

export function ArticleList(props: IProps) {
  const {articles, loading} = props;
  const viewRef = useRef<HTMLDivElement>(null);
  const [, setPageNumber] = useState(1);

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

  return (
    <ArticleListView
      viewRef={viewRef}
      onPageNumberChange={onPageNumberChange}
      articleList={articles}
      loading={loading}
    />
  );
}
