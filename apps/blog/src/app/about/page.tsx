import type {Metadata} from 'next';

export {About as default} from './Container';

export const metadata: Metadata = {
  title: '关于 - Soulike 的博客',
};

export const revalidate = 3600;
