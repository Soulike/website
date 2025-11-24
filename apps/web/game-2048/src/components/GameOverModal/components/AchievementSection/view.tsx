import {STRING_KEY, useI18nString} from '@/i18n/index.js';

import styles from './styles.module.css';

export interface AchievementSectionProps {
  isNewRecord: boolean;
}

export function AchievementSection({isNewRecord}: AchievementSectionProps) {
  const newHighScoreText = useI18nString(STRING_KEY.NEW_HIGH_SCORE);

  if (!isNewRecord) {
    return null;
  }

  return (
    <div className={styles.achievementSection}>
      <span className={styles.emoji}>🏆</span>
      <div className={styles.achievementText}>{newHighScoreText}</div>
    </div>
  );
}
