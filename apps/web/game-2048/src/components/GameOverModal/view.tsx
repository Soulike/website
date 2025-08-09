import {Paper} from '@mui/material';

import {AchievementSection} from './components/AchievementSection/index.js';
import {ActionButtons} from './components/ActionButtons/index.js';
import {GameStatistics} from './components/GameStatistics/index.js';
import {Overlay} from './Overlay/index.js';
import styles from './styles.module.css';

export interface GameOverModalViewProps {
  open: boolean;
  onClose: () => void;
  score: number;
  highestScore: number;
  isNewRecord: boolean;
}

export function View({
  open,
  onClose,
  score,
  highestScore,
  isNewRecord,
}: GameOverModalViewProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.GameOverModal}>
      <Overlay onClick={onClose} />
      <Paper className={styles.modal} elevation={8}>
        <div className={styles.title}>Game Over</div>

        <div className={styles.subtitle}>
          No more moves available! But you put up a good fight.
        </div>

        <AchievementSection isNewRecord={isNewRecord} />

        <GameStatistics score={score} highestScore={highestScore} />

        <ActionButtons onClose={onClose} />
      </Paper>
    </div>
  );
}
