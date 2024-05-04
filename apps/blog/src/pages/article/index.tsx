import {useRouter} from 'next/router';
import {useEffect} from 'react';

import {PAGE_ID, PAGE_ID_TO_ROUTE} from '@/src/config/route';
import {getArticleLink} from '@/src/utils/route';

/**
 * For backward compatibility. Redirect article?id=xxx to article/xxx
 */
export default function ArticleRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const {id} = router.query;
      if (typeof id !== 'string') {
        void router.replace(PAGE_ID_TO_ROUTE[PAGE_ID.INDEX]);
        return;
      }

      const idNum = Number.parseInt(id);
      if (Number.isNaN(idNum)) {
        void router.replace(PAGE_ID_TO_ROUTE[PAGE_ID.INDEX]);
        return;
      }

      void router.replace(getArticleLink(idNum));
    }
  }, [router]);

  return <></>;
}
