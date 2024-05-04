import Head from 'next/head';

import {IndexArticleList} from '@/src/components/IndexArticleList';
import {useArticlesWithAbstract} from '@/src/hooks/useArticlesWithAbstract';

export function Index() {
  const {loading, articlesWithAbstract} = useArticlesWithAbstract();

  return (
    <>
      <Head>
        <title>Soulike 的博客</title>
      </Head>
      <IndexArticleList
        articleList={articlesWithAbstract ?? []}
        loading={loading}
      />
    </>
  );
}
