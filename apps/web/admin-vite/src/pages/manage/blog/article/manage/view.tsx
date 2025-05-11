import {ArticleList} from '@/components/ArticleList';

import styles from './styles.module.css';

export function Manage() {
  return (
    <div className={styles.Manage}>
      <ArticleList />
    </div>
  );
}
