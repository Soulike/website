import '@/index.css';

import assert from 'assert/strict';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

const rootHTMLElement = document.getElementById('root');
assert(rootHTMLElement, 'The root HTMLElement for React is missing.');

const reactRoot = createRoot(rootHTMLElement);

reactRoot.render(<StrictMode></StrictMode>);
