import {Button} from '@/components/Button/index.js';
import {NewGameButton} from '@/components/NewGameButton/index.js';

import styles from './styles.module.css';

export interface ActionButtonsProps {
  onClose: () => void;
}

export function ActionButtons({onClose}: ActionButtonsProps) {
  return (
    <div className={styles.actions}>
      <Button variant='secondary' onClick={onClose}>
        Close
      </Button>
      <NewGameButton />
    </div>
  );
}
