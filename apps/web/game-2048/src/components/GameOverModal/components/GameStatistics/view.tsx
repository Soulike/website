import {STRING_KEY, useI18nString} from '@/i18n/index.js';

import styles from './styles.module.css';

export interface GameStatisticsProps {
  score: number;
  highestScore: number;
}

export function GameStatistics({score, highestScore}: GameStatisticsProps) {
  const gameStatisticsTitle = useI18nString(STRING_KEY.GAME_STATISTICS_TITLE);
  const finalScoreLabel = useI18nString(STRING_KEY.FINAL_SCORE_LABEL);
  const bestScoreLabel = useI18nString(STRING_KEY.BEST_SCORE_STATISTICS_LABEL);

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsTitle}>{gameStatisticsTitle}</div>
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>{finalScoreLabel}</div>
          <div className={styles.statValue}>{score.toLocaleString()}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>{bestScoreLabel}</div>
          <div className={styles.statValue}>
            {highestScore.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
