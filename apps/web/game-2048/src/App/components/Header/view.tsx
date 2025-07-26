import {Button, type ButtonProps} from '@mui/material';

import {Score} from './components/Score/index.js';
import styles from './styles.module.css';

export interface HeaderViewProps {
  onNewGameButtonClick: ButtonProps['onClick'];
}

export function View({onNewGameButtonClick}: HeaderViewProps) {
  return (
    <div className={styles.Header}>
      <div className={styles.leftSection}>
        <div className={styles.gameTitle}>2048</div>
      </div>
      <div className={styles.middleSection}>
        <Score />
      </div>
      <div className={styles.rightSection}>
        <Button
          color={'inherit'}
          variant={'outlined'}
          size={'large'}
          onClick={onNewGameButtonClick}
        >
          New Game
        </Button>
      </div>
    </div>
  );
}
