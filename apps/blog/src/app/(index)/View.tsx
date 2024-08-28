import {Article} from '@website/classes';

import {IndexArticleList} from '@/src/components/IndexArticleList';

export interface IndexViewProps {
  articlesWithAbstract: Article[];
  loading: boolean;
}

export function IndexView(props: IndexViewProps) {
  const {loading, articlesWithAbstract} = props;

  return (
    <IndexArticleList articleList={articlesWithAbstract} loading={loading} />
  );
}
