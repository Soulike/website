import {Metadata} from 'next';

import {ArticleViewModel} from './ArticleViewModel';
import {type ArticleProps} from './Container';

export {Article as default} from './Container';

export async function generateMetadata({
  params,
}: ArticleProps): Promise<Metadata> {
  const article = await ArticleViewModel.getArticle(Number.parseInt(params.id));
  const {title} = article;

  return {
    title: `${title} - Soulike 的博客`,
  };
}
