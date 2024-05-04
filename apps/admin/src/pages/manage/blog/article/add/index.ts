import dynamic from 'next/dynamic';

export default dynamic(
  async () =>
    await import('@/page-components/Manage/Blog/Article/Add').then(
      ({Add}) => Add,
    ),
  {ssr: false},
);
