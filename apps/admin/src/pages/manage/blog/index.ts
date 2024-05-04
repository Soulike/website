import dynamic from 'next/dynamic';

export default dynamic(
  async () =>
    await import('@/page-components/Manage/Blog').then(
      ({BlogIndex}) => BlogIndex,
    ),
  {ssr: false},
);
