import {useCallback, useEffect, useState} from 'react';

import {GRID_SIDE_LENGTH} from '@/constants/configs.js';
import {
  type GridChangeEventListener,
  type GridType,
  model,
  type Movement,
} from '@/model/index.js';

export function useViewModel() {
  const grid = useGrid();
  const isTileNewlyCreated = useIsTileNewlyCreated();
  const isTileMerged = useIsTileMerged();
  const tileMovements = useTileMovements();
  return {grid, isTileNewlyCreated, isTileMerged, tileMovements};
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

function useIsTileMerged() {
  const createIsTileMerged = useCallback(() => {
    const isTileMerged: boolean[][] = new Array<boolean[]>(GRID_SIDE_LENGTH);
    for (let i = 0; i < isTileMerged.length; i++) {
      isTileMerged[i] = new Array<boolean>(GRID_SIDE_LENGTH);
    }
    return isTileMerged;
  }, []);

  const [isTileMerged, setIsTileMerged] =
    useState<boolean[][]>(createIsTileMerged());

  const onGridChangeEventListener: GridChangeEventListener = useCallback(
    (_newGrid, movements) => {
      const isTileMerged = createIsTileMerged();

      for (const {to} of movements.mergeMovements) {
        isTileMerged[to.row][to.col] = true;
      }
      setIsTileMerged(isTileMerged);
    },
    [createIsTileMerged],
  );

  useEffect(() => {
    model.addListener('gridChange', onGridChangeEventListener);
    return () => {
      model.removeListener('gridChange', onGridChangeEventListener);
    };
  }, [onGridChangeEventListener]);

  return isTileMerged;
}

function useTileMovements() {
  const createTileMovements = useCallback(() => {
    const tileMovements: (Movement | undefined)[][] = new Array<
      (Movement | undefined)[]
    >(GRID_SIDE_LENGTH);
    for (let i = 0; i < tileMovements.length; i++) {
      tileMovements[i] = new Array<Movement | undefined>(GRID_SIDE_LENGTH);
    }
    return tileMovements;
  }, []);

  const [tileMovements, setTileMovements] = useState<
    (Movement | undefined)[][]
  >(createTileMovements());

  const onGridChangeEventListener: GridChangeEventListener = useCallback(
    (_newGrid, movements) => {
      const tileMovements = createTileMovements();

      for (const movement of movements.mergeMovements) {
        tileMovements[movement.from.row][movement.from.col] = movement;
      }

      for (const movement of movements.compactMovements) {
        tileMovements[movement.from.row][movement.from.col] = movement;
      }

      setTileMovements(tileMovements);
    },
    [createTileMovements],
  );

  useEffect(() => {
    model.addListener('gridChange', onGridChangeEventListener);
    return () => {
      model.removeListener('gridChange', onGridChangeEventListener);
    };
  }, [onGridChangeEventListener]);

  return tileMovements;
}
