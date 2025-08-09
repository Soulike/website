import {Modal} from '@/components/Modal/index.js';

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
    <Modal open={open} onClose={onClose}>
      <div className={styles.title}>Game Over</div>

      <div className={styles.subtitle}>
        No more moves available! But you put up a good fight.
      </div>

      <AchievementSection isNewRecord={isNewRecord} />

      <GameStatistics score={score} highestScore={highestScore} />

      <ActionButtons onClose={onClose} />
    </Modal>
  );
}
