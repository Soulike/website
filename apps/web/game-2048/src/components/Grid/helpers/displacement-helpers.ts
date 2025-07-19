import type {Movement} from '@/model/index.js';

import type {TilePixelDisplacement} from '../types.js';

export function getTileMovementPixelDisplacement(
  tileElement: HTMLElement,
  movement: Movement,
  horizontalGap: number,
  verticalGap: number,
): TilePixelDisplacement {
  console.log(movement);

  const {from, to} = movement;
  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;

  const tileWidth = tileElement.clientWidth;
  const tileHeight = tileElement.clientHeight;

  console.log({
    x: colDiff * (tileHeight + verticalGap),
    y: rowDiff * (tileWidth + horizontalGap),
  });

  return {
    x: colDiff * (tileHeight + verticalGap),
    y: rowDiff * (tileWidth + horizontalGap),
  };
}
