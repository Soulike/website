import dynamic from 'next/dynamic';

export default dynamic(
    async () =>
        await import('@/page-components/Login').then(({Login}) => Login),
    {ssr: false},
);
