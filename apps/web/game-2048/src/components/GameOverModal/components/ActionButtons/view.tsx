import {NewGameButton} from '../../../NewGameButton/index.js';
import styles from './styles.module.css';

export interface ActionButtonsProps {
  onClose: () => void;
}

export function ActionButtons({onClose}: ActionButtonsProps) {
  return (
    <div className={styles.actions}>
      <button
        onClick={onClose}
        className={`${styles.actionButton} ${styles.secondaryButton}`}
      >
        Close
      </button>
      <NewGameButton
        className={`${styles.actionButton} ${styles.primaryButton}`}
      />
    </div>
  );
}
