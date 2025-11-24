import {STRING_KEY, useI18nString} from '@/i18n/index.js';

import styles from './styles.module.css';

export interface IFooterViewProps {
  currentYear: string;
}

export function View({currentYear}: IFooterViewProps) {
  const developedByText = useI18nString(STRING_KEY.FOOTER_DEVELOPED_BY);

  return (
    <div className={styles.Footer}>
      {currentYear} - {developedByText}
    </div>
  );
}
