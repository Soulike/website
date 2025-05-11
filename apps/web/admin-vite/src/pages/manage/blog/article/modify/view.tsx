import {
  ArticleEditor,
  type ArticleEditorProps,
} from '@/components/ArticleEditor';

import Style from './styles.module.css';

export function ModifyView(props: ArticleEditorProps) {
  return (
    <div className={Style.Modify}>
      <ArticleEditor {...props} />
    </div>
  );
}
