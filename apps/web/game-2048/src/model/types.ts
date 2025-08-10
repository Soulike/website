import type {GameManagerEvents} from '@/model/interfaces/game-manager.js';
import type {ScoreManagerEvents} from '@/model/interfaces/score-manager.js';

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
  scoreChange: number;
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

export type GridType = number[][];
export type ReadOnlyGridType = readonly (readonly number[])[];

export type ModelEvents = GameManagerEvents | ScoreManagerEvents;
