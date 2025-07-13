import assert from 'node:assert';

import {useMemo} from 'react';

import {Tile} from '@/components/Grid/components/Tile/index.js';
import {GRID_SIDE_LENGTH} from '@/constants/configs.js';
import type {GridType} from '@/model/index.js';

import styles from './styles.module.css';

export interface GridViewProps {
  grid: GridType;
}

export function GridView(props: GridViewProps) {
  const {grid} = props;
  assert(grid.length === GRID_SIDE_LENGTH);
  assert(grid[0].length === GRID_SIDE_LENGTH);

  const tileComponents = useMemo(() => {
    const tiles = [];
    for (let i = 0; i < GRID_SIDE_LENGTH; i++) {
      for (let j = 0; j < GRID_SIDE_LENGTH; j++) {
        tiles.push(
          <Tile key={`${String(i)}-${String(j)}`} value={grid[i][j]} />,
        );
      }
    }
    return tiles;
  }, [grid]);

  return <div className={styles.Grid}>{...tileComponents}</div>;
}
