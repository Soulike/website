import {useEffect, useRef} from 'react';

import styles from './styles.module.css';

export interface ScoreCardProps {
  label: string;
  value: number;
}

export function ScoreCard({label, value}: ScoreCardProps) {
  const valueRef = useRef<HTMLDivElement>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current === value) {
      return;
    }
    prevValueRef.current = value;
    requestAnimationFrame(() => {
      valueRef.current?.animate(
        [
          {transform: 'scale(1)'},
          {transform: 'scale(1.2)'},
          {transform: 'scale(1)'},
        ],
        {
          duration: 200,
          easing: 'ease-out',
        },
      );
    });
  }, [value]);

  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div ref={valueRef} className={styles.value}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}
