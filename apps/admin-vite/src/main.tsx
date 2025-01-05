import 'reset-css/reset.css';
import './main.css';

import assert from 'node:assert';

import {ConfigProvider} from 'antd';
import enUS from 'antd/locale/en_US.js';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {Router} from '@/router';

const rootHTMLElement = document.getElementById('root');
assert(rootHTMLElement, 'The root HTMLElement for React is missing.');

const reactRoot = createRoot(rootHTMLElement);

reactRoot.render(
  <StrictMode>
    <ConfigProvider locale={enUS}>
      <Router />
    </ConfigProvider>
  </StrictMode>,
);
