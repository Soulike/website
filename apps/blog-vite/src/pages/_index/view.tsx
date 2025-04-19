import {Article} from '@website/classes';

import {ArticleList} from '@/components/ArticleList';

import styles from './styles.module.css';

export interface IndexViewProps {
  articles: Article[];
  loading: boolean;
}

export function IndexView(props: IndexViewProps) {
  const {loading, articles} = props;

  return (
    <div className={styles.Index}>
      <ArticleList articles={articles} loading={loading} />
    </div>
  );
}
