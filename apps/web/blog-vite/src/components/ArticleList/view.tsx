import {type Article} from '@schema/blog';
import {Empty, Listy, Pagination, type PaginationProps, Spin} from 'antd';
import {RefObject} from 'react';

import {ArticleListItem} from './components/ArticleListItem';
import styles from './styles.module.css';

interface Props {
  viewRef: RefObject<HTMLDivElement | null>;
  currentPage: number;
  pageSize: number;
  totalArticles: number;
  onPageNumberChange: NonNullable<PaginationProps['onChange']>;
  articleList: Article[];
  loading: boolean;
}

export function ArticleListView(props: Props) {
  const {
    currentPage,
    pageSize,
    totalArticles,
    onPageNumberChange,
    articleList,
    loading,
    viewRef,
  } = props;
  return (
    <div className={styles.ArticleList} ref={viewRef}>
      <Spin spinning={loading}>
        {totalArticles === 0 ? (
          loading ? (
            <div className={styles.emptyPlaceholder} />
          ) : (
            <Empty description={'暂无文章'} />
          )
        ) : (
          <>
            <Listy<Article>
              items={articleList}
              rowKey={'id'}
              rowHoverable={false}
              classNames={{item: styles.listyItem}}
              itemRender={(article) => <ArticleListItem article={article} />}
            />
            <Pagination
              className={styles.pagination}
              align={'end'}
              current={currentPage}
              pageSize={pageSize}
              total={totalArticles}
              showSizeChanger={false}
              hideOnSinglePage={true}
              onChange={onPageNumberChange}
            />
          </>
        )}
      </Spin>
    </div>
  );
}
