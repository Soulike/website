import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

export function usePathIsMatch() {
  const [isMatch, setIsMatch] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      if (window.location.pathname === router.pathname) {
        setIsMatch(true);
      } else {
        setIsMatch(false);
        void router.replace(`${window.location.pathname}`);
      }
    }
  }, [router]);

  return isMatch;
}
