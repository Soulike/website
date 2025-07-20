import type {Coordinate} from '../types.js';

export function isCoordinatesEqual(
  coordinate1: Coordinate,
  coordinate2: Coordinate,
): boolean {
  return (
    coordinate1.row === coordinate2.row && coordinate1.col === coordinate2.col
  );
}
