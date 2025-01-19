import {StyledComponentsRegistry} from '@website/react-components/next-js';
import type React from 'react';

import {ThemeProvider} from './components/ThemeProvider';
import {RootLayoutView} from './View';

export interface IRootLayoutProps {
  children?: React.ReactNode;
}

export function RootLayout(props: IRootLayoutProps) {
  const {children} = props;

  return (
    <ThemeProvider>
      <StyledComponentsRegistry>
        <RootLayoutView>
          <ThemeProvider>{children}</ThemeProvider>
        </RootLayoutView>
      </StyledComponentsRegistry>
    </ThemeProvider>
  );
}
