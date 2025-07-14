import styles from './styles.module.css';

export interface TileViewProps {
  value: number;
  textColor: string;
  backgroundColor: string;
  fontSize: string;
  newlyCreated: boolean;
}

export function TileView(props: TileViewProps) {
  const {value, textColor, backgroundColor, fontSize, newlyCreated} = props;
  return (
    <div
      className={`${styles.Tile} ${newlyCreated ? styles.newlyCreated : ''}`}
      style={{backgroundColor, color: textColor, fontSize}}
    >
      {value}
    </div>
  );
}
