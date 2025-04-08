import path from 'node:path';

import {useEffect, useState} from 'react';

import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

export function useArticleLink(articleId: string) {
  const [articleLink, setArticleLink] = useState('');

  useEffect(() => {
    setArticleLink(path.join(PAGE_ID_TO_PATH[PAGE_ID.ARTICLE], articleId));
  }, [articleId]);

  return articleLink;
}
