import {useState} from 'react';

import {View} from './view.js';

export function Footer() {
  const [currentYear] = useState(() => new Date().getFullYear().toString());

  return <View currentYear={currentYear} />;
}
