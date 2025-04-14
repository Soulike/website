import type React from 'react';

import {ThemeProvider} from '@/components/ThemeProvider';

import {RootLayoutView} from './view.js';

export interface IRootLayoutProps {
  children?: React.ReactNode;
}

export function RootLayout(props: IRootLayoutProps) {
  const {children} = props;

  return (
    <ThemeProvider>
      <RootLayoutView>{children}</RootLayoutView>
    </ThemeProvider>
  );
}
