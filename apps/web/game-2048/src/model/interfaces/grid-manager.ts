import type {Coordinate, ReadOnlyGridType} from '../types.js';

export interface GridManager {
  getGrid(): ReadOnlyGridType;
  getEmptyTileCount(): number;
  resetGrid(): void;
  setTileValue(coordinate: Coordinate, value: number): void;
}
