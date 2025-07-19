import assert from 'node:assert';

import {type ReactElement, useCallback, useMemo} from 'react';

import {
  playTileCreationAnimation,
  playTileMoveAnimation,
  playTilePopAnimation,
} from '@/components/Grid/helpers/animation-helpers.js';
import {getTileMovementPixelDisplacement} from '@/components/Grid/helpers/displacement-helpers.js';
import {
  TILE_CREATION_ANIMATION_DURATION,
  TILE_MOVE_ANIMATION_DURATION,
  TILE_POP_ANIMATION_DURATION,
} from '@/constants/animation.js';
import {GRID_SIDE_LENGTH} from '@/constants/configs.js';
import {TileGapInPixel} from '@/constants/sizes.js';
import type {GridType, Movement} from '@/model/index.js';

import {type Animate, Tile} from './components/Tile/index.js';
import styles from './styles.module.css';

export interface GridViewProps {
  grid: GridType;
  isTileNewlyCreated: boolean[][];
  isTileMergeDestination: boolean[][];
  isTileMovementDestination: boolean[][];
  tileMovements: (Movement | undefined)[][];
}

export function GridView(props: GridViewProps) {
  const {
    grid,
    isTileNewlyCreated,
    isTileMergeDestination,
    tileMovements,
    isTileMovementDestination,
  } = props;
  assert(grid.length === GRID_SIDE_LENGTH);
  assert(grid[0].length === GRID_SIDE_LENGTH);

  const newlyCreatedAnimate: Animate = useCallback((element: HTMLElement) => {
    return playTileCreationAnimation(element, TILE_CREATION_ANIMATION_DURATION);
  }, []);

  const mergedAnimate: Animate = useCallback((element: HTMLElement) => {
    return playTilePopAnimation(element, TILE_POP_ANIMATION_DURATION);
  }, []);

  const generateMovementAnimate: (movement: Movement) => Animate = useCallback(
    (movement) => {
      return (element) => {
        const displacement = getTileMovementPixelDisplacement(
          element,
          movement,
          TileGapInPixel.HORIZONTAL,
          TileGapInPixel.VERTICAL,
        );
        return playTileMoveAnimation(
          element,
          displacement,
          TILE_MOVE_ANIMATION_DURATION,
        );
      };
    },
    [],
  );

  const tileComponents = useMemo(() => {
    const tiles: ReactElement[] = [];
    for (let i = 0; i < GRID_SIDE_LENGTH; i++) {
      for (let j = 0; j < GRID_SIDE_LENGTH; j++) {
        const movement = tileMovements[i][j];
        const movementAnimate = movement
          ? generateMovementAnimate(movement)
          : null;

        const isMergeDestination = isTileMergeDestination[i][j];
        const mergeAnimate = isMergeDestination ? mergedAnimate : null;

        const isNewlyCreated = isTileNewlyCreated[i][j];
        const creationAnimate = isNewlyCreated ? newlyCreatedAnimate : null;

        tiles.push(
          <Tile
            key={`${String(i)}-${String(j)}`}
            value={grid[i][j]}
            movementAnimate={movementAnimate}
            mergeAnimate={mergeAnimate}
            creationAnimate={creationAnimate}
            isMovementDestination={!!isTileMovementDestination[i][j]}
            updatedAtTimestamp={Date.now()}
          />,
        );
      }
    }
    return tiles;
  }, [
    generateMovementAnimate,
    grid,
    isTileMergeDestination,
    isTileNewlyCreated,
    mergedAnimate,
    newlyCreatedAnimate,
    tileMovements,
  ]);

  return <div className={styles.Grid}>{...tileComponents}</div>;
}
