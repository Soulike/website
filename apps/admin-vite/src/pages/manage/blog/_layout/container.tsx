import {Outlet, useLocation} from 'react-router';

import {LayoutView} from './view.js';

export function Layout() {
  const {pathname} = useLocation();

  return (
    <LayoutView pathname={pathname}>
      <Outlet />
    </LayoutView>
  );
}
