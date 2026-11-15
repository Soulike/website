import {type Article} from '@schema/blog';
import type {PaginationProps} from 'antd';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {showErrorNotification} from '@/helpers/error-notification-helper.js';

import {ArticleListView} from './view.js';
import {useViewModel} from './view-model.js';

const DEFAULT_PAGE_SIZE = 10;

interface IProps {
  category?: number; // 限定文章的分类
  onArticleDeleted?: (id: Article['id']) => void;
}

export function ArticleList(props: IProps) {
  const {category, onArticleDeleted} = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const {
    idToArticle,
    idToArticleLoading,
    idToArticleError,
    handleDeleteArticleSuccess,
  } = useViewModel(category);

  const handleArticleDeleted = useCallback(
    (id: Article['id']) => {
      handleDeleteArticleSuccess(id);
      onArticleDeleted?.(id);
    },
    [handleDeleteArticleSuccess, onArticleDeleted],
  );

  const onPaginationChange: NonNullable<PaginationProps['onChange']> =
    useCallback((page, nextPageSize) => {
      setCurrentPage(page);
      setPageSize(nextPageSize);
    }, []);

  useEffect(() => {
    if (idToArticleError) {
      showErrorNotification(idToArticleError);
    }
  }, [idToArticleError]);

  const articleIds = useMemo(
    () => Array.from(idToArticle?.keys() ?? []),
    [idToArticle],
  );
  const totalPages = Math.max(1, Math.ceil(articleIds.length / pageSize));
  const effectiveCurrentPage = Math.min(currentPage, totalPages);
  const paginatedArticleIds = useMemo(() => {
    const startIndex = (effectiveCurrentPage - 1) * pageSize;
    return articleIds.slice(startIndex, startIndex + pageSize);
  }, [articleIds, effectiveCurrentPage, pageSize]);

  return (
    <ArticleListView
      loading={idToArticleLoading}
      articleIds={paginatedArticleIds}
      totalArticles={articleIds.length}
      currentPage={effectiveCurrentPage}
      pageSize={pageSize}
      onPaginationChange={onPaginationChange}
      onDeleteArticleSuccess={handleArticleDeleted}
    />
  );
}
