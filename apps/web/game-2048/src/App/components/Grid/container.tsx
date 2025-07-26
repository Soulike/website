import {GridView} from './view';
import {useViewModel} from './view-model.js';

export function Grid() {
  const {
    grid,
    isTileNewlyCreated,
    tileMovements,
    isTileMergeDestination,
    isTileMovementDestination,
  } = useViewModel();
  return (
    <GridView
      grid={grid}
      isTileNewlyCreated={isTileNewlyCreated}
      isTileMergeDestination={isTileMergeDestination}
      isTileMovementDestination={isTileMovementDestination}
      tileMovements={tileMovements}
    />
  );
}
