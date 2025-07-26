import {View} from './view.js';

export function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();

  return <View currentYear={currentYear} />;
}
