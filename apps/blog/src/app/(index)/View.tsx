import {Article} from '@website/classes';

import {ArticleList} from '@/src/components/ArticleList';

import style from './style.module.scss';

export interface IndexViewProps {
  articlesWithAbstract: Article[];
  loading: boolean;
}

export function IndexView(props: IndexViewProps) {
  const {loading, articlesWithAbstract} = props;

  return (
    <div className={style.Index}>
      <ArticleList articleList={articlesWithAbstract} loading={loading} />
    </div>
  );
}
