import 'antd/dist/reset.css';
import './main.css';

import assert from 'node:assert';

import {ErrorBoundary} from '@website/react-components';
import {ConfigProvider} from 'antd';
import enUS from 'antd/locale/en_US.js';
import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';

import {Loading} from '@/components/Loading';
import {NotFound} from '@/components/NotFound';

import App from './App.tsx';

const rootHTMLElement = document.getElementById('root');
assert(rootHTMLElement, 'The root HTMLElement for React is missing.');

const reactRoot = createRoot(rootHTMLElement);

reactRoot.render(
  <StrictMode>
    <ConfigProvider locale={enUS}>
      <ErrorBoundary fallback={<NotFound />}>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </ConfigProvider>
  </StrictMode>,
);
