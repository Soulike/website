import {getFullYearString} from '@/helpers/date-helpers.js';

import {SiteFooterView} from './view.js';

export function SiteFooter() {
  const fullYear = getFullYearString();
  return <SiteFooterView fullYear={fullYear} />;
}
