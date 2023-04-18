import dynamic from 'next/dynamic';

const promise = import('./Container').then(({ArticleList}) => ArticleList);

export const ArticleList = dynamic(async () => await promise, {ssr: false});
