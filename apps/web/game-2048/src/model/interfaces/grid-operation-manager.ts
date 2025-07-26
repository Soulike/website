import type {CompactMovement, MergeMovement, TileCreation} from '../types.js';

export interface GridOperationManager {
  compactRow(row: number, toLeft: boolean): CompactMovement[];
  compactCol(col: number, toUp: boolean): CompactMovement[];
  mergeRow(row: number, toLeft: boolean): MergeMovement[];
  mergeCol(col: number, toUp: boolean): MergeMovement[];
  createNewTile(count: number): TileCreation[];
}
