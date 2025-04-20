import {Outlet} from 'react-router';

import {RootLayoutView} from './view.js';

export function RootLayout() {
  return (
    <RootLayoutView>
      <Outlet />
    </RootLayoutView>
  );
}
