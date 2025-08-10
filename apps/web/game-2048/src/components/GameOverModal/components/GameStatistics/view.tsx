import styles from './styles.module.css';

export interface GameStatisticsProps {
  score: number;
  highestScore: number;
}

export function GameStatistics({score, highestScore}: GameStatisticsProps) {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsTitle}>Game Statistics</div>
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Final Score</div>
          <div className={styles.statValue}>{score.toLocaleString()}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Best Score</div>
          <div className={styles.statValue}>
            {highestScore.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
