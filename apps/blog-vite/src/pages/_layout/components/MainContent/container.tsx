import {getFullYearString} from '@/helpers/date-helpers.js';

import {MainContentView} from './view.js';

export interface IMainContentProps {
  children?: React.ReactNode;
}

export function MainContent({children}: IMainContentProps) {
  const fullYear = getFullYearString();

  return <MainContentView fullYear={fullYear}>{children}</MainContentView>;
}
