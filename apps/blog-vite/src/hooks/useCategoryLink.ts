import path from 'node:path/posix';

import {useEffect, useState} from 'react';

import {PAGE_ID, PAGE_ID_TO_PATH} from '@/router/page-config';

export function useCategoryLink(categoryId: string) {
  const [categoryLink, setCategoryLink] = useState('');

  useEffect(() => {
    setCategoryLink(path.join(PAGE_ID_TO_PATH[PAGE_ID.CATEGORY], categoryId));
  }, [categoryId]);

  return categoryLink;
}
