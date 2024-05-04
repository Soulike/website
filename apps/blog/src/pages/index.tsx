import dynamic from 'next/dynamic';

import {usePathIsMatch} from '@/src/hooks/usePathIsMatch';

const IndexPromise = import('@/src/page-components/Index').then(
  ({Index}) => Index,
);

const Index = dynamic(async () => await IndexPromise, {ssr: false});

export default function IndexPage() {
  const isMatch = usePathIsMatch();

  return isMatch ? <Index /> : null;
}
