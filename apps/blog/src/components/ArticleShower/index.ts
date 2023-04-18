import dynamic from 'next/dynamic';
const promise = import('./Container').then(({ArticleShower}) => ArticleShower);

export const ArticleShower = dynamic(async () => await promise, {ssr: false});
