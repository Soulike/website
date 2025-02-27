import type {JSX} from 'react';
import {Link, LinkProps} from 'react-router';

import {useArticleLink} from '@/hooks/useArticleLink.js';

interface Props extends Omit<LinkProps, 'to' | 'target' | 'rel'> {
  articleId: number;
  children?: JSX.Element;
}

export function ArticleLink(props: Props) {
  const {children, articleId, ...rest} = props;
  const articleLink = useArticleLink(articleId.toString());
  return (
    <Link
      to={articleLink}
      {...rest}
      target={'_blank'}
      rel='noopener norefferrer'
    >
      {children}
    </Link>
  );
}
