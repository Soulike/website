import {useCallback, useEffect, useState} from 'react';

import {type GridType, model} from '@/model/index.js';

export function useViewModel() {
  const grid = useGridViewModel();
  return {grid};
}

function useGridViewModel() {
  const [grid, setGrid] = useState<GridType>(model.getGrid());

  const onGridChangeEventListener = useCallback((newGrid: GridType) => {
    setGrid([...newGrid]);
  }, []);

  useEffect(() => {
    model.onGridChange(onGridChangeEventListener);
    return () => {
      model.offGridChange(onGridChangeEventListener);
    };
  }, [onGridChangeEventListener]);

  return grid;
}
