import {type ReactNode} from 'react';
import {useLocation} from 'react-router';

import {LayoutView} from './view.tsx';

interface Props {
  children: ReactNode;
}

export function Layout(props: Props) {
  const {pathname} = useLocation();
  const {children} = props;

  return <LayoutView pathname={pathname}>{children}</LayoutView>;
}
