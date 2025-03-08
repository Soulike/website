import {
  ArticleEditor,
  type ArticleEditorProps,
} from '@/components/ArticleEditor';

import styles from './styles.module.css';

export function AddView(props: ArticleEditorProps) {
  return (
    <div className={styles.Add}>
      <ArticleEditor {...props} />
    </div>
  );
}
