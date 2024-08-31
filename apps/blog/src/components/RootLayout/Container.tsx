import type React from 'react';

import {AntdWrapper} from '@/src/components/RootLayout/components/AntdWrapper';

import {RootLayoutView} from './View';

export interface IRootLayoutProps {
  children?: React.ReactNode;
}

export async function RootLayout(props: IRootLayoutProps) {
  const {children} = props;

  return (
    <AntdWrapper>
      <RootLayoutView>{children}</RootLayoutView>
    </AntdWrapper>
  );
}
