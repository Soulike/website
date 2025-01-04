import {BrowserRouter, useRoutes} from 'react-router';

import {CONFIG} from './config.tsx';

function Routes() {
  return useRoutes(CONFIG);
}

export const Router = () => (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
);
