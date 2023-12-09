import dynamic from 'next/dynamic';

export default dynamic(
    async () =>
        await import('@/page-components/Manage/Blog/Category/Add').then(
            ({Add}) => Add,
        ),
    {ssr: false},
);
