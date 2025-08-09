import {Dialog} from '@mui/material';

import {AchievementSection} from './components/AchievementSection/index.js';
import {ActionButtons} from './components/ActionButtons/index.js';
import {GameStatistics} from './components/GameStatistics/index.js';
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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='game-over-title'
      className={styles.modal}
      slotProps={{
        paper: {
          className: styles.modalContent,
        },
      }}
    >
      <div className={styles.title}>Game Over</div>

      <div className={styles.subtitle}>
        No more moves available! But you put up a good fight.
      </div>

      <AchievementSection isNewRecord={isNewRecord} />

      <GameStatistics score={score} highestScore={highestScore} />

      <ActionButtons onClose={onClose} />
    </Dialog>
  );
}
