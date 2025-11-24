import {Button} from '@/components/Button/index.js';
import {NewGameButton} from '@/components/NewGameButton/index.js';
import {STRING_KEY, useI18nString} from '@/i18n/index.js';

import styles from './styles.module.css';

export interface ActionButtonsProps {
  onClose: () => void;
}

export function ActionButtons({onClose}: ActionButtonsProps) {
  const closeText = useI18nString(STRING_KEY.CLOSE_BUTTON);

  return (
    <div className={styles.actions}>
      <Button variant='secondary' onClick={onClose}>
        {closeText}
      </Button>
      <NewGameButton />
    </div>
  );
}
