import dynamic from 'next/dynamic';

export default dynamic(
  async () =>
    await import('@/page-components/Manage/Blog/Category/Manage').then(
      ({Manage}) => Manage,
    ),
  {ssr: false},
);
