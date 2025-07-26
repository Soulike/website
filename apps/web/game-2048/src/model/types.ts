export interface Coordinate {
  row: number;
  col: number;
}

export enum MovementType {
  MERGE = 'merge',
  COMPACT = 'compact',
}

export interface Movement {
  from: Readonly<Coordinate>;
  to: Readonly<Coordinate>;
  type: MovementType;
}

export interface MergeMovement extends Movement {
  type: MovementType.MERGE;
}

export interface CompactMovement extends Movement {
  type: MovementType.COMPACT;
}

export interface OperationMovements {
  mergeMovements: readonly MergeMovement[];
  compactMovements: readonly CompactMovement[];
}

export interface TileCreation {
  coordinate: Readonly<Coordinate>;
  value: number;
}

export type GridType = readonly (readonly number[])[];

export type GridChangeEventListener = (
  grid: GridType,
  movements: Readonly<OperationMovements>,
  creations: readonly Readonly<TileCreation>[],
) => void;

export type GameOverEventListener = (targetAccomplished: boolean) => void;

export type ScoreChangeEventListener = (score: number) => void;

export interface ModelEvents {
  gridChange: Parameters<GridChangeEventListener>;
  gameOver: Parameters<GameOverEventListener>;
  scoreChange: Parameters<ScoreChangeEventListener>;
}
