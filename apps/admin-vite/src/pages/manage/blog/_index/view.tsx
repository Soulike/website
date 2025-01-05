import svg from './assets/macbook.svg';
import styles from './styles.module.css';

export function Index() {
  return (
    <div className={styles.Index}>
      <img className={styles.image} src={svg} alt='macbook' />
    </div>
  );
}
