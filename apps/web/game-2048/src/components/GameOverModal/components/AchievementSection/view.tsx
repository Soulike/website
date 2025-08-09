import styles from './styles.module.css';

export interface AchievementSectionProps {
  isNewRecord: boolean;
}

export function AchievementSection({isNewRecord}: AchievementSectionProps) {
  if (!isNewRecord) {
    return null;
  }

  return (
    <div className={styles.achievementSection}>
      <span className={styles.emoji}>🏆</span>
      <div className={styles.achievementText}>New High Score!</div>
    </div>
  );
}
