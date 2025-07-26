import './main.css';
import './constants/colors/ui-colors.js';

import assert from 'node:assert';

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {App} from './App/index.js';

const rootHTMLElement = document.getElementById('root');
assert(rootHTMLElement, 'The root HTMLElement for React is missing.');

createRoot(rootHTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
