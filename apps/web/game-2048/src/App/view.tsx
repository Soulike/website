import {GameOverModal} from '../components/GameOverModal/index.js';
import {Footer} from './components/Footer/index.js';
import {Grid} from './components/Grid/index.js';
import {Header} from './components/Header/index.js';
import styles from './styles.module.css';

export interface ViewProps {
  isGameOverModalOpen: boolean;
  onCloseGameOverModal: () => void;
}

export function View({isGameOverModalOpen, onCloseGameOverModal}: ViewProps) {
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
      <GameOverModal
        open={isGameOverModalOpen}
        onClose={onCloseGameOverModal}
      />
    </div>
  );
}
