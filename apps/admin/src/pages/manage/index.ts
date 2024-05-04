import dynamic from 'next/dynamic';

export default dynamic(
  async () =>
    await import('@/page-components/Manage').then(
      ({ManageIndex}) => ManageIndex,
    ),
  {ssr: false},
);
