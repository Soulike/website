import styles from './styles.module.css';

export interface OverlayProps {
  onClick: () => void;
}

export function Overlay({onClick}: OverlayProps) {
  return <div className={styles.overlay} onClick={onClick} />;
}
