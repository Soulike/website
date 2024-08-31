import {SiteFooterView} from './View';
import {SiteFooterViewModel} from './ViewModel';

export function SiteFooter() {
  const fullYear = SiteFooterViewModel.getCurrentFullYear();
  return <SiteFooterView fullYear={fullYear} />;
}
