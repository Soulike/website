import {BrowserRouter, useRoutes} from 'react-router';

import {CONFIG} from './route-config.js';

function Routes() {
  return useRoutes(CONFIG);
}

export const Router = () => (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
);
