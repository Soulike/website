import dynamic from 'next/dynamic';

export default dynamic(
    async () =>
        await import('@/page-components/Manage/Blog/Article/Modify').then(
            ({Modify}) => Modify,
        ),
    {ssr: false},
);
