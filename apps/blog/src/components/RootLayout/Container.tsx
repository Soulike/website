import type React from 'react';

import {ThemeProvider} from '../ThemeProvider';
import {RootLayoutView} from './View';

export interface IRootLayoutProps {
  children?: React.ReactNode;
}

export function RootLayout(props: IRootLayoutProps) {
  const {children} = props;

  return (
    <ThemeProvider>
      <RootLayoutView>
        <ThemeProvider>{children}</ThemeProvider>
      </RootLayoutView>
    </ThemeProvider>
  );
}
