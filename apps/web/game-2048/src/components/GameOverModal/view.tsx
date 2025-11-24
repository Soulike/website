import {Modal} from '@/components/Modal/index.js';
import {STRING_KEY, useI18nString} from '@/i18n/index.js';

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
  const gameOverTitle = useI18nString(STRING_KEY.GAME_OVER_TITLE);
  const gameOverSubtitle = useI18nString(STRING_KEY.GAME_OVER_SUBTITLE);

  return (
    <Modal open={open} onOverlayClick={onClose}>
      <div className={styles.title}>{gameOverTitle}</div>

      <div className={styles.subtitle}>{gameOverSubtitle}</div>

      <AchievementSection isNewRecord={isNewRecord} />

      <GameStatistics score={score} highestScore={highestScore} />

      <ActionButtons onClose={onClose} />
    </Modal>
  );
}
