import svg from './assets/network_2.svg';
import styles from './styles.module.css';

export function Index() {
  return (
    <div className={styles.Index}>
      <img className={styles.image} src={svg} alt='Manage Index Image' />
    </div>
  );
}
