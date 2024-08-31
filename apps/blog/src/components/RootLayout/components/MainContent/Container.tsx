import type React from 'react';

import {MainContentView} from './View';
import {MainContentViewModel} from './ViewModel';

export interface IMainContentProps {
  children?: React.ReactNode;
}

export function MainContent({children}: IMainContentProps) {
  const fullYear = MainContentViewModel.getCurrentFullYear();

  return <MainContentView fullYear={fullYear}>{children}</MainContentView>;
}
