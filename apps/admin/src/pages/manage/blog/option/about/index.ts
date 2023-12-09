import dynamic from 'next/dynamic';

export default dynamic(
    async () =>
        await import('@/page-components/Manage/Blog/Option/About').then(
            ({About}) => About,
        ),
    {ssr: false},
);
