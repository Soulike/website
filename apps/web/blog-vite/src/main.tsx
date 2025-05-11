import 'antd/dist/reset.css';
import './main.css';

import assert from 'node:assert';

import {ErrorBoundary} from '@website/react-components';
import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';

import {Loading} from '@/components/Loading';
import {NotFound} from '@/components/NotFound';
import {ThemeProvider} from '@/components/ThemeProvider/index.js';
import {Router} from '@/router/index.js';

const rootHTMLElement = document.getElementById('root');
assert(rootHTMLElement, 'The root HTMLElement for React is missing.');

const reactRoot = createRoot(rootHTMLElement);

reactRoot.render(
  <StrictMode>
    <ErrorBoundary fallback={<NotFound />}>
      <Suspense fallback={<Loading />}>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
