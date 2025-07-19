import {useEffect, useRef} from 'react';

import type {Coordinate} from '@/model/index.js';

import {playTilePopAnimation} from './helpers/animation-helpers.js';
import styles from './styles.module.css';

export interface TileViewProps {
  value: number;
  textColor: string;
  backgroundColor: string;
  fontSize: string;
  newlyCreated: boolean;
  movedFrom: Coordinate | null;
  movedTo: Coordinate | null;
  updatedAtTimestamp: number;
}

export function TileView(props: TileViewProps) {
  const {
    value,
    textColor,
    backgroundColor,
    fontSize,
    newlyCreated,
    updatedAtTimestamp,
  } = props;
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!newlyCreated || !elementRef.current) {
      return;
    }
    void playTilePopAnimation(elementRef.current);
  }, [newlyCreated, updatedAtTimestamp]);

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
