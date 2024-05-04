import {Article as ArticleClass, Category} from '@website/classes';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect, useMemo} from 'react';

import {useArticle} from '@/src/hooks/useArticle';
import {useCategory} from '@/src/hooks/useCategory';
import {useSearchParam} from '@/src/hooks/useSearchParam';

import {ArticleView} from './View';

export function Article() {
  const router = useRouter();
  const emptyArticle = useMemo(
    () => new ArticleClass(0, '', '', 0, '', '', 0, true),
    [],
  );
  const emptyCategory = useMemo(() => new Category(0, ''), []);

  const [id] = useSearchParam('id');
  const articleId = Number.parseInt(id ?? '');

  const {loading: articleIsLoading, article} = useArticle(articleId);

  useEffect(() => {
    if (!articleIsLoading && article === null) {
      void router.replace('/404');
    }
  }, [article, articleIsLoading, router]);

  const {loading: categoryIsLoading, category} = useCategory(
    article?.category ?? NaN,
  );

  const loading = useMemo(
    () => articleIsLoading || categoryIsLoading,
    [articleIsLoading, categoryIsLoading],
  );
  const {title, publicationTime, modificationTime} = useMemo(
    () => article ?? emptyArticle,
    [article, emptyArticle],
  );
  return (
    <>
      <Head>
        {loading ? null : <title>{`${title} - Soulike 的博客`}</title>}
      </Head>
      <ArticleView
        title={title}
        contentMarkdown={article?.content ?? ''}
        publicationTime={publicationTime}
        modificationTime={modificationTime}
        loading={loading}
        category={category ?? emptyCategory}
      />
    </>
  );
}
