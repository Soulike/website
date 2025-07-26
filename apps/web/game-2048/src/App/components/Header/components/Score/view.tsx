import {Button} from '@mui/material';

import styles from './styles.module.css';

export interface ScoreViewProps {
  score: number;
}

export function View({score}: ScoreViewProps) {
  return (
    <Button
      variant={'outlined'}
      size={'large'}
      color={'inherit'}
      disabled={true}
    >
      <div className={styles.inner}>
        <div>Score</div>
        <div>{score}</div>
      </div>
    </Button>
  );
}
