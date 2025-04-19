import type {JSX} from 'react';
import {Link, LinkProps} from 'react-router';

import {getArticleLink} from '@/helpers/link-helpers.js';

interface Props extends Omit<LinkProps, 'to' | 'target' | 'rel'> {
  articleId: number;
  children?: JSX.Element;
}

export function ArticleLink(props: Props) {
  const {children, articleId, ...rest} = props;
  const articleLink = getArticleLink(articleId);
  return (
    <Link
      to={articleLink}
      {...rest}
      target={'_blank'}
      rel='noopener noreferrer'
    >
      {children}
    </Link>
  );
}
