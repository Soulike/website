import styles from './styles.module.css';

export interface TileViewProps {
  value: number;
  textColor: string;
  backgroundColor: string;
}

export function TileView(props: TileViewProps) {
  const {value, textColor, backgroundColor} = props;
  return (
    <div className={styles.Tile} style={{backgroundColor, color: textColor}}>
      {value}
    </div>
  );
}
