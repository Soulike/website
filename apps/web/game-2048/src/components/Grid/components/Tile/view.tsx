import {useEffect, useRef} from 'react';

import styles from './styles.module.css';

export type Animate = (element: HTMLElement) => void;

export interface TileViewProps {
  value: number;
  textColor: string;
  backgroundColor: string;
  fontSize: string;
  animate: Animate | null;
  updatedAtTimestamp: number;
}

export function TileView(props: TileViewProps) {
  const {
    value,
    textColor,
    backgroundColor,
    fontSize,
    animate,
    updatedAtTimestamp,
  } = props;
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current || !animate) {
      return;
    }
    animate(elementRef.current);
  }, [animate, updatedAtTimestamp]);

  return (
    <div
      ref={elementRef}
      className={styles.Tile}
      style={{backgroundColor, color: textColor, fontSize}}
    >
      {value}
    </div>
  );
}
