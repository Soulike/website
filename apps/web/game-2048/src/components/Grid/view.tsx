import assert from 'node:assert';

import {type ReactElement, useCallback, useMemo} from 'react';

import {playTilePopAnimation} from '@/components/Grid/helpers/animation-helpers.js';
import {GRID_SIDE_LENGTH} from '@/constants/configs.js';
import type {GridType} from '@/model/index.js';

import {type Animate, Tile} from './components/Tile/index.js';
import styles from './styles.module.css';

export interface GridViewProps {
  grid: GridType;
  isTileNewlyCreated: boolean[][];
}

export function GridView(props: GridViewProps) {
  const {grid, isTileNewlyCreated} = props;
  assert(grid.length === GRID_SIDE_LENGTH);
  assert(grid[0].length === GRID_SIDE_LENGTH);

  const newlyCreatedAnimate = useCallback((element: HTMLElement) => {
    void playTilePopAnimation(element);
  }, []);

  const tileComponents = useMemo(() => {
    const tiles: ReactElement[] = [];
    for (let i = 0; i < GRID_SIDE_LENGTH; i++) {
      for (let j = 0; j < GRID_SIDE_LENGTH; j++) {
        let animate: Animate | null = null;
        if (isTileNewlyCreated[i][j]) {
          animate = newlyCreatedAnimate;
        }

        tiles.push(
          <Tile
            key={`${String(i)}-${String(j)}`}
            value={grid[i][j]}
            animate={animate}
            updatedAtTimestamp={Date.now()}
          />,
        );
      }
    }
    return tiles;
  }, [grid, isTileNewlyCreated]);

  return <div className={styles.Grid}>{...tileComponents}</div>;
}
