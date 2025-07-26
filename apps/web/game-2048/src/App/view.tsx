import {Footer} from './components/Footer/index.js';
import {Grid} from './components/Grid/index.js';
import {Header} from './components/Header/index.js';
import styles from './styles.module.css';

export function View() {
  return (
    <div className={styles.App}>
      <div className={styles.gameContainer}>
        <header className={styles.headerContainer}>
          <Header />
        </header>
        <main className={styles.gridContainer}>
          <Grid />
        </main>
        <footer className={styles.footerContainer}>
          <Footer />
        </footer>
      </div>
    </div>
  );
}
