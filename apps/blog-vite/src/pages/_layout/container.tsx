import {ErrorBoundary} from '@website/react-components';
import {Suspense} from 'react';
import {Outlet} from 'react-router';

import {Loading} from '@/components/Loading/index.js';
import {NotFound} from '@/components/NotFound/index.js';
import {ThemeProvider} from '@/components/ThemeProvider';

import {RootLayoutView} from './view.js';

export function RootLayout() {
  return (
    <ErrorBoundary fallback={<NotFound />}>
      <Suspense fallback={<Loading />}>
        <ThemeProvider>
          <RootLayoutView>
            <Outlet />
          </RootLayoutView>
        </ThemeProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
