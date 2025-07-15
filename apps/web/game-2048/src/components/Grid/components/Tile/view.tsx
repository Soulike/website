import {useEffect, useMemo, useRef} from 'react';

import styles from './styles.module.css';

export interface TileViewProps {
  value: number;
  textColor: string;
  backgroundColor: string;
  fontSize: string;
  newlyCreated: boolean;
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

  const animationKeyframes: Parameters<HTMLElement['animate']>[0] = useMemo(
    () => [
      {transform: 'scale(0)', opacity: 0},
      {transform: 'scale(1.05)', opacity: 1, offset: 0.5},
      {transform: 'scale(1)', opacity: 1},
    ],
    [],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!newlyCreated || !elementRef.current) {
        return;
      }
      elementRef.current.animate(animationKeyframes, {
        duration: 400,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      });
    });
  }, [animationKeyframes, newlyCreated, updatedAtTimestamp]);

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
