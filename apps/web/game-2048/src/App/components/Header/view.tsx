import {NewGameButton} from '@/components/NewGameButton/index.js';

import {Score} from './components/Score/index.js';
import styles from './styles.module.css';

export function View() {
  return (
    <div className={styles.Header}>
      <div className={styles.leftSection}>
        <div className={styles.gameTitle}>2048</div>
      </div>
      <div className={styles.middleSection}>
        <Score />
      </div>
      <div className={styles.rightSection}>
        <NewGameButton />
      </div>
    </div>
  );
}
