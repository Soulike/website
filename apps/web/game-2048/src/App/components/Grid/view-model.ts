import {useCallback, useEffect, useState} from 'react';

import {GRID_SIDE_LENGTH} from '@/constants/configs.js';
import {
  type GridChangeEventListener,
  model,
  type Movement,
  type ReadOnlyGridType,
} from '@/model/index.js';

export function useViewModel() {
  const grid = useGrid();
  const isTileNewlyCreated = useIsTileNewlyCreated();
  const isTileMergeDestination = useIsTileMergeDestination();
  const isTileMovementDestination = useIsTileMovementDestination();
  const tileMovements = useTileMovements();
  return {
    grid,
    isTileNewlyCreated,
    isTileMergeDestination,
    isTileMovementDestination,
    tileMovements,
  };
}

function useGrid() {
  const [grid, setGrid] = useState<ReadOnlyGridType>(model.getGrid());

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

function useIsTileMergeDestination() {
  const createIsTileMergeDestination = useCallback(() => {
    const isTileMergeDestination: boolean[][] = new Array<boolean[]>(
      GRID_SIDE_LENGTH,
    );
    for (let i = 0; i < isTileMergeDestination.length; i++) {
      isTileMergeDestination[i] = new Array<boolean>(GRID_SIDE_LENGTH);
    }
    return isTileMergeDestination;
  }, []);

  const [isTileMergeDestination, setIsTileMergeDestination] = useState<
    boolean[][]
  >(createIsTileMergeDestination());

  const onGridChangeEventListener: GridChangeEventListener = useCallback(
    (_newGrid, movements) => {
      const isTileMergeDestination = createIsTileMergeDestination();

      for (const {to} of movements.mergeMovements) {
        isTileMergeDestination[to.row][to.col] = true;
      }
      setIsTileMergeDestination(isTileMergeDestination);
    },
    [createIsTileMergeDestination],
  );

  useEffect(() => {
    model.addListener('gridChange', onGridChangeEventListener);
    return () => {
      model.removeListener('gridChange', onGridChangeEventListener);
    };
  }, [onGridChangeEventListener]);

  return isTileMergeDestination;
}

function useIsTileMovementDestination() {
  const createIsTileMovementDestination = useCallback(() => {
    const isTileMovementDestination: boolean[][] = new Array<boolean[]>(
      GRID_SIDE_LENGTH,
    );
    for (let i = 0; i < isTileMovementDestination.length; i++) {
      isTileMovementDestination[i] = new Array<boolean>(GRID_SIDE_LENGTH);
    }
    return isTileMovementDestination;
  }, []);

  const [isTileMovementDestination, setIsTileMovementDestination] = useState<
    boolean[][]
  >(createIsTileMovementDestination());

  const onGridChangeEventListener: GridChangeEventListener = useCallback(
    (_newGrid, movements) => {
      const isTileMovementDestination = createIsTileMovementDestination();

      for (const movement of movements.compactMovements) {
        isTileMovementDestination[movement.to.row][movement.to.col] = true;
      }

      setIsTileMovementDestination(isTileMovementDestination);
    },
    [createIsTileMovementDestination],
  );

  useEffect(() => {
    model.addListener('gridChange', onGridChangeEventListener);
    return () => {
      model.removeListener('gridChange', onGridChangeEventListener);
    };
  }, [onGridChangeEventListener]);

  return isTileMovementDestination;
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
