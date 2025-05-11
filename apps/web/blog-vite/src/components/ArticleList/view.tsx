import {type Article} from '@website/classes';
import {Empty, List} from 'antd';
import type {PaginationConfig} from 'antd/lib/pagination';
import {RefObject} from 'react';

import {ArticleListItem} from './components/ArticleListItem';
import styles from './styles.module.css';

interface Props {
  viewRef: RefObject<HTMLDivElement | null>;
  onPageNumberChange: PaginationConfig['onChange'];
  articleList: Article[];
  loading: boolean;
}

export function ArticleListView(props: Props) {
  const {onPageNumberChange, articleList, loading, viewRef} = props;
  return (
    <div className={styles.ArticleList} ref={viewRef}>
      <List
        loading={loading}
        dataSource={articleList}
        split={false}
        locale={{
          emptyText: <Empty description={'暂无文章'} />,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          position: 'bottom',
          hideOnSinglePage: true,
          onChange: onPageNumberChange,
        }}
        renderItem={(article) => <ArticleListItem article={article} />}
      ></List>
    </div>
  );
}
