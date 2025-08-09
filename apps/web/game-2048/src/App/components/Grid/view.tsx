import assert from 'node:assert';

import {type ReactElement, type RefObject, useCallback, useMemo} from 'react';

import {
  TILE_CREATION_ANIMATION_DURATION,
  TILE_MOVE_ANIMATION_DURATION,
  TILE_POP_ANIMATION_DURATION,
} from '@/constants/animation.js';
import {GRID_SIDE_LENGTH} from '@/constants/configs.js';
import type {Movement, ReadOnlyGridType} from '@/model/index.js';

import {type Animate, Tile} from './components/Tile/index.js';
import {
  playTileCreationAnimation,
  playTileMergeAnimation,
  playTileMoveAnimation,
} from './helpers/animation-helpers.js';
import {getTileMovementPixelDisplacement} from './helpers/displacement-helpers.js';
import {useResponsiveBorderRadius} from './hooks/useResponsiveBorderRadius.js';
import {useResponsiveGridSize} from './hooks/useResponsiveGridSize.js';
import {useResponsiveTileGap} from './hooks/useResponsiveTileGap.js';
import styles from './styles.module.css';

export interface GridViewProps {
  grid: ReadOnlyGridType;
  isTileNewlyCreated: boolean[][];
  isTileMergeDestination: boolean[][];
  isTileMovementDestination: boolean[][];
  tileMovements: (Movement | undefined)[][];
  viewDomRef: RefObject<HTMLDivElement | null>;
}

export function GridView(props: GridViewProps) {
  const {
    grid,
    isTileNewlyCreated,
    isTileMergeDestination,
    tileMovements,
    isTileMovementDestination,
    viewDomRef,
  } = props;
  assert(grid.length === GRID_SIDE_LENGTH);
  assert(grid[0].length === GRID_SIDE_LENGTH);

  const gridSize = useResponsiveGridSize();
  const borderRadius = useResponsiveBorderRadius();
  const {gapSizes} = useResponsiveTileGap();

  const newlyCreatedAnimate: Animate = useCallback((element: HTMLElement) => {
    return playTileCreationAnimation(element, TILE_CREATION_ANIMATION_DURATION);
  }, []);

  const mergedAnimate: Animate = useCallback((element: HTMLElement) => {
    return playTileMergeAnimation(element, TILE_POP_ANIMATION_DURATION);
  }, []);

  const generateMovementAnimate: (movement: Movement) => Animate = useCallback(
    (movement) => {
      return (element) => {
        const displacement = getTileMovementPixelDisplacement(
          element,
          movement,
          gapSizes.horizontal,
          gapSizes.vertical,
        );
        return playTileMoveAnimation(
          element,
          displacement,
          TILE_MOVE_ANIMATION_DURATION,
        );
      };
    },
    [gapSizes],
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
    isTileMovementDestination,
    isTileNewlyCreated,
    mergedAnimate,
    newlyCreatedAnimate,
    tileMovements,
  ]);

  return (
    <div
      ref={viewDomRef}
      className={styles.Grid}
      style={{
        width: `${gridSize}px`,
        gap: `${gapSizes.horizontal}px`,
        padding: `${gapSizes.horizontal}px`,
        borderRadius: `${borderRadius}px`,
      }}
    >
      {...tileComponents}
    </div>
  );
}
