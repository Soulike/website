import {ArticleViewModel} from '@/src/app/article/[id]/ArticleViewModel';

import {ArticleView} from './View';

export interface ArticleProps {
  params: ArticleDynamicParams;
}

interface ArticleDynamicParams {
  id: string;
}

export async function Article({params}: ArticleProps) {
  const article = await ArticleViewModel.getArticle(Number.parseInt(params.id));
  const category = await ArticleViewModel.getCategory(article.category);

  const {title, publicationTime, modificationTime} = article;

  return (
    <ArticleView
      title={title}
      contentMarkdown={article.content}
      publicationTime={publicationTime}
      modificationTime={modificationTime}
      category={category}
    />
  );
}
