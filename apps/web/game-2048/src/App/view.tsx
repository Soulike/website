import {Grid} from './components/Grid/index.js';
import styles from './styles.module.css';

export function View() {
  return (
    <div className={styles.App}>
      <div className={styles.gameContainer}>
        <header className={styles.headerContainer}></header>
        <main className={styles.gridContainer}>
          <Grid />
        </main>
        <footer className={styles.footerContainer}></footer>
      </div>
    </div>
  );
}
