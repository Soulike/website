import {Button} from '@mui/material';

import styles from './styles.module.css';

export interface ScoreCardProps {
  label: string;
  value: number;
}

export function ScoreCard({label, value}: ScoreCardProps) {
  return (
    <Button
      variant={'outlined'}
      size={'large'}
      color={'inherit'}
      disabled={true}
    >
      <div className={styles.inner}>
        <div>{label}</div>
        <div>{value}</div>
      </div>
    </Button>
  );
}
