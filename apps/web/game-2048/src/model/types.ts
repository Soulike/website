export interface Coordinate {
  row: number;
  col: number;
}

export interface Movement {
  from: Readonly<Coordinate>;
  to: Readonly<Coordinate>;
}

export interface OperationMovements {
  mergeMovements: readonly Movement[];
  compactMovements: readonly Movement[];
}

export interface TileCreation {
  coordinate: Readonly<Coordinate>;
  value: number;
}

export type GridChangeEventListener = (
  grid: GridType,
  movements: Readonly<OperationMovements>,
  creations: readonly Readonly<TileCreation>[],
) => void;

export type GridType = readonly (readonly number[])[];
