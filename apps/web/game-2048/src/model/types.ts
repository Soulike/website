export interface Coordinate {
  row: number;
  col: number;
}

export interface Movement {
  from: Coordinate;
  to: Coordinate;
}

export interface OperationMovements {
  mergeMovements: Movement[];
  compactMovements: Movement[];
}

export type GridChangeEventListener = (grid: GridType) => void;

export type GridType = readonly (readonly number[])[];
