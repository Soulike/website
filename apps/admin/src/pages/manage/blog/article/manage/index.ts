import dynamic from 'next/dynamic';

export default dynamic(
  async () =>
    await import('@/page-components/Manage/Blog/Article/Manage').then(
      ({Manage}) => Manage,
    ),
  {ssr: false},
);
