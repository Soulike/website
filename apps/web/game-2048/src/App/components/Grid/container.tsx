import {useRef} from 'react';

import {GridView} from './view';
import {useViewModel} from './view-model.js';

export function Grid() {
  const viewDomRef = useRef<HTMLDivElement>(null);

  const {
    grid,
    isTileNewlyCreated,
    tileMovements,
    isTileMergeDestination,
    isTileMovementDestination,
  } = useViewModel(viewDomRef);

  return (
    <GridView
      grid={grid}
      isTileNewlyCreated={isTileNewlyCreated}
      isTileMergeDestination={isTileMergeDestination}
      isTileMovementDestination={isTileMovementDestination}
      tileMovements={tileMovements}
      viewDomRef={viewDomRef}
    />
  );
}
