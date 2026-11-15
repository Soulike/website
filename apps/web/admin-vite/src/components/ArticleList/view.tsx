import {type Article} from '@schema/blog';
import {
  Empty,
  Listy,
  Pagination,
  type PaginationProps,
  Skeleton,
  theme,
} from 'antd';

import {ArticleListItem} from './components/ArticleListItem';
import styles from './styles.module.css';

interface Props {
  loading: boolean;
  articleIds: Article['id'][];
  totalArticles: number;
  currentPage: number;
  pageSize: number;
  onPaginationChange: NonNullable<PaginationProps['onChange']>;
  onDeleteArticleSuccess: (id: Article['id']) => void;
}

export function ArticleListView(props: Props) {
  const {
    loading,
    articleIds,
    totalArticles,
    currentPage,
    pageSize,
    onPaginationChange,
    onDeleteArticleSuccess,
  } = props;
  const {token} = theme.useToken();

  const borderedStyle = {
    border: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
    borderRadius: token.borderRadiusLG,
  };

  return (
    <div className={styles.ArticleList}>
      <Skeleton loading={loading} active={true} paragraph={{rows: 15}}>
        {totalArticles === 0 ? (
          <div className={styles.emptyContainer} style={borderedStyle}>
            <Empty />
          </div>
        ) : (
          <>
            <Listy<Article['id']>
              items={articleIds}
              rowKey={(id) => id}
              rowHoverable={false}
              classNames={{root: styles.listyRoot}}
              styles={{
                root: borderedStyle,
                item: {paddingInline: token.paddingLG},
              }}
              itemRender={(articleId) => {
                return (
                  <ArticleListItem
                    id={articleId}
                    onDeleteArticleSuccess={onDeleteArticleSuccess}
                  />
                );
              }}
            />
            <Pagination
              className={styles.pagination}
              align={'end'}
              current={currentPage}
              pageSize={pageSize}
              total={totalArticles}
              pageSizeOptions={['5', '10', '15', '20']}
              showSizeChanger={true}
              hideOnSinglePage={true}
              onChange={onPaginationChange}
            />
          </>
        )}
      </Skeleton>
    </div>
  );
}
