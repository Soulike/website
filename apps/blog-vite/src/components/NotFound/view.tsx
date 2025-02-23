import notFoundImage from './assets/404_page_not_found_1.svg';
import styles from './styles.module.css';

export function NotFound() {
  return (
    <div className={styles.notFound}>
      <img src={notFoundImage} alt='not found image' className={styles.image} />
    </div>
  );
}
