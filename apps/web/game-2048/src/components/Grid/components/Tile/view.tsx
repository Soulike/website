import styles from './styles.module.css';

export interface TileViewProps {
  value: number;
  textColor: string;
  backgroundColor: string;
  fontSize: string;
}

export function TileView(props: TileViewProps) {
  const {value, textColor, backgroundColor, fontSize} = props;
  return (
    <div
      className={styles.Tile}
      style={{backgroundColor, color: textColor, fontSize}}
    >
      {value}
    </div>
  );
}
