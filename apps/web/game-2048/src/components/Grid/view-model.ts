import {useCallback, useEffect, useState} from 'react';

import {GRID_SIDE_LENGTH} from '@/constants/configs.js';
import {
  type GridChangeEventListener,
  type GridType,
  model,
} from '@/model/index.js';

export function useViewModel() {
  const grid = useGrid();
  const isTileNewlyCreated = useIsTileNewlyCreated();
  return {grid, isTileNewlyCreated};
}

function useGrid() {
  const [grid, setGrid] = useState<GridType>(model.getGrid());

  const onGridChangeEventListener: GridChangeEventListener = useCallback(
    (newGrid) => {
      setGrid([...newGrid]);
    },
    [],
  );

  useEffect(() => {
    model.addListener('gridChange', onGridChangeEventListener);
    return () => {
      model.removeListener('gridChange', onGridChangeEventListener);
    };
  }, [onGridChangeEventListener]);

  return grid;
}

function useIsTileNewlyCreated() {
  const createIsTileNewlyCreated = useCallback(() => {
    const isTileNewlyCreated: boolean[][] = new Array<boolean[]>(
      GRID_SIDE_LENGTH,
    );
    for (let i = 0; i < isTileNewlyCreated.length; i++) {
      isTileNewlyCreated[i] = new Array<boolean>(GRID_SIDE_LENGTH);
    }
    return isTileNewlyCreated;
  }, []);

  const [isTileNewlyCreated, setIsTileNewlyCreated] = useState<boolean[][]>(
    createIsTileNewlyCreated(),
  );

  const onGridChangeEventListener: GridChangeEventListener = useCallback(
    (_newGrid, _movements, creations) => {
      const isTileNewlyCreated = createIsTileNewlyCreated();

      for (const {
        coordinate: {row, col},
      } of creations) {
        isTileNewlyCreated[row][col] = true;
      }
      setIsTileNewlyCreated(isTileNewlyCreated);
    },
    [createIsTileNewlyCreated],
  );

  useEffect(() => {
    model.addListener('gridChange', onGridChangeEventListener);
    return () => {
      model.removeListener('gridChange', onGridChangeEventListener);
    };
  }, [onGridChangeEventListener]);

  return isTileNewlyCreated;
}
