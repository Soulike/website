import {GridView} from './view';
import {useViewModel} from './view-model.js';

export function Grid() {
  const {grid, isTileNewlyCreated} = useViewModel();
  return <GridView grid={grid} isTileNewlyCreated={isTileNewlyCreated} />;
}
