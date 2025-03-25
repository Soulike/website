import {type Article} from '@website/classes';
import {List, Skeleton} from 'antd';

import {ArticleListItem} from './components/ArticleListItem';
import styles from './styles.module.css';

interface Props {
  loading: boolean;
  // TODO: We only need all ids. Add /article/getAllIds server API to save network transfer
  idToArticle: Map<number, Article>;
  onDeleteArticleSuccess: (id: Article['id']) => void;
}

export function ArticleListView(props: Props) {
  const {loading, idToArticle, onDeleteArticleSuccess} = props;

  return (
    <div className={styles.ArticleList}>
      <Skeleton loading={loading} active={true} paragraph={{rows: 15}}>
        <List
          dataSource={Array.from(idToArticle.keys())}
          bordered={true}
          pagination={{
            position: 'bottom',
            pageSizeOptions: ['5', '10', '15', '20'],
            showSizeChanger: true,
            hideOnSinglePage: true,
          }}
          renderItem={(articleId) => {
            return (
              <ArticleListItem
                id={articleId}
                onDeleteArticleSuccess={onDeleteArticleSuccess}
              />
            );
          }}
        />
      </Skeleton>
    </div>
  );
}
