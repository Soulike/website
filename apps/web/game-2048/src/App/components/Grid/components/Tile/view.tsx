import {type Ref} from 'react';

import styles from './styles.module.css';

export type Animate = (element: HTMLElement) => Promise<void>;

export interface TileViewProps {
  value: number;
  textColor: string;
  backgroundColor: string;
  fontSize: string;
  zIndex: number;
  ref: Ref<HTMLDivElement>;
}

export function TileView(props: TileViewProps) {
  const {value, textColor, backgroundColor, fontSize, zIndex, ref} = props;

  return (
    <div
      ref={ref}
      className={styles.Tile}
      style={{backgroundColor, color: textColor, fontSize, zIndex}}
    >
      {value}
    </div>
  );
}
