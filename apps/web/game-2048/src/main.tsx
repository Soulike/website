import './main.css';

import assert from 'node:assert';

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import App from './App.tsx';

const rootHTMLElement = document.getElementById('root');
assert(rootHTMLElement, 'The root HTMLElement for React is missing.');

createRoot(rootHTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
