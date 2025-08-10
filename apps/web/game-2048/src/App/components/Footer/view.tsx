import styles from './styles.module.css';

export interface IFooterViewProps {
  currentYear: string;
}

export function View({currentYear}: IFooterViewProps) {
  return (
    <div className={styles.Footer}>{currentYear} - Developed by Soulike</div>
  );
}
