import {GridView} from './view';
import {useViewModel} from './view-model.js';

export function Grid() {
  const {grid, isTileNewlyCreated, tileMovements, isTileMerged} =
    useViewModel();
  return (
    <GridView
      grid={grid}
      isTileNewlyCreated={isTileNewlyCreated}
      isTileMerged={isTileMerged}
      tileMovements={tileMovements}
    />
  );
}
