import assert from 'node:assert';

import {EMPTY_TILE_VALUE, NEW_TILE_VALUES} from '@/constants/configs.js';
import {pickRandomElement} from '@/helpers/random-helpers.js';

import type {GridManager} from '../interfaces/grid-manager.js';
import type {GridOperationManager} from '../interfaces/grid-operation-manager.js';
import {
  type CompactMovement,
  type Coordinate,
  type MergeMovement,
  MovementType,
  type TileCreation,
} from '../types.js';

export class GridOperationManagerImpl implements GridOperationManager {
  private readonly gridManager: GridManager;

  constructor(gridManager: GridManager) {
    this.gridManager = gridManager;
  }

  private get grid() {
    return this.gridManager.getGrid();
  }

  private get emptyTileCount() {
    return this.gridManager.getEmptyTileCount();
  }

  public compactRow(row: number, toLeft: boolean): CompactMovement[] {
    const rowLength = this.grid[0].length;
    const colStart = toLeft ? 0 : rowLength - 1;
    const colEnd = toLeft ? rowLength : -1;
    const colMoveStep = toLeft ? 1 : -1;

    const movements: CompactMovement[] = [];

    let writeCol = colStart;
    for (let readCol = colStart; readCol !== colEnd; readCol += colMoveStep) {
      if (this.grid[row][readCol] !== EMPTY_TILE_VALUE) {
        if (writeCol !== readCol) {
          this.setTileValue({row: row, col: writeCol}, this.grid[row][readCol]);
          this.setTileValue({row: row, col: readCol}, EMPTY_TILE_VALUE);

          movements.push({
            from: {row: row, col: readCol},
            to: {row: row, col: writeCol},
            type: MovementType.COMPACT,
          });
        }
        writeCol += colMoveStep;
      }
    }

    return movements;
  }

  public compactCol(col: number, toUp: boolean): CompactMovement[] {
    const colLength = this.grid.length;
    const rowStart = toUp ? 0 : colLength - 1;
    const rowEnd = toUp ? colLength : -1;
    const rowMoveStep = toUp ? 1 : -1;

    const movements: CompactMovement[] = [];

    let writeRow = rowStart;
    for (let readRow = rowStart; readRow !== rowEnd; readRow += rowMoveStep) {
      if (this.grid[readRow][col] !== EMPTY_TILE_VALUE) {
        if (writeRow !== readRow) {
          this.setTileValue({row: writeRow, col: col}, this.grid[readRow][col]);
          this.setTileValue({row: readRow, col: col}, EMPTY_TILE_VALUE);

          movements.push({
            from: {row: readRow, col: col},
            to: {row: writeRow, col: col},
            type: MovementType.COMPACT,
          });
        }
        writeRow += rowMoveStep;
      }
    }

    return movements;
  }

  public mergeRow(row: number, toLeft: boolean): MergeMovement[] {
    const rowLength = this.grid[0].length;
    const colStart = toLeft ? 0 : rowLength - 1;
    const colEnd = toLeft ? rowLength : -1;
    const colMoveStep = toLeft ? 1 : -1;

    const movements: MergeMovement[] = [];

    for (let col = colStart; col !== colEnd; col += colMoveStep) {
      if (this.grid[row][col] === EMPTY_TILE_VALUE) {
        continue;
      }

      for (
        let nextCol = col + colMoveStep;
        nextCol !== colEnd;
        nextCol += colMoveStep
      ) {
        if (this.grid[row][nextCol] === EMPTY_TILE_VALUE) {
          continue;
        }
        if (this.grid[row][nextCol] === this.grid[row][col]) {
          this.setTileValue({row: row, col: nextCol}, EMPTY_TILE_VALUE);
          const newValue = this.grid[row][col] * 2;
          this.setTileValue({row: row, col}, newValue);

          movements.push({
            from: {row: row, col: nextCol},
            to: {row: row, col},
            type: MovementType.MERGE,
            scoreChange: newValue,
          });
          break;
        } else {
          // Found different value, impossible to merge. Move to next tile.
          break;
        }
      }
    }
    return movements;
  }

  public mergeCol(col: number, toUp: boolean): MergeMovement[] {
    const colLength = this.grid.length;
    const rowStart = toUp ? 0 : colLength - 1;
    const rowEnd = toUp ? colLength : -1;
    const rowMoveStep = toUp ? 1 : -1;

    const movements: MergeMovement[] = [];

    for (let row = rowStart; row !== rowEnd; row += rowMoveStep) {
      if (this.grid[row][col] === EMPTY_TILE_VALUE) {
        continue;
      }

      for (
        let nextRow = row + rowMoveStep;
        nextRow !== rowEnd;
        nextRow += rowMoveStep
      ) {
        if (this.grid[nextRow][col] === EMPTY_TILE_VALUE) {
          continue;
        }
        if (this.grid[nextRow][col] === this.grid[row][col]) {
          this.setTileValue({row: nextRow, col: col}, EMPTY_TILE_VALUE);
          const newValue = this.grid[row][col] * 2;
          this.setTileValue({row, col: col}, newValue);

          movements.push({
            from: {row: nextRow, col: col},
            to: {row, col: col},
            type: MovementType.MERGE,
            scoreChange: newValue,
          });
          break;
        } else {
          // Found different value, impossible to merge. Move to next tile.
          break;
        }
      }
    }
    return movements;
  }

  public createNewTile(count: number): TileCreation[] {
    assert(count > 0);
    const emptyTiles = this.getRandomEmptyTiles(count);
    assert(emptyTiles?.length == count, 'No enough empty tiles');
    const creations: TileCreation[] = [];
    for (const {row, col} of emptyTiles) {
      this.setTileValue({row, col}, this.getRandomNewTileValue());
      creations.push({coordinate: {row, col}, value: this.grid[row][col]});
    }
    return creations;
  }

  /**
   * Use reservoir sampling algorithm to randomly select empty tiles.
   * @param count Number of empty tiles to select
   * @returns Array of coordinates of empty tiles {row, col}. If not enough empty tiles, returns null.
   */
  private getRandomEmptyTiles(count: number): Coordinate[] | null {
    assert(count > 0);

    const reservoir: Coordinate[] = [];
    let totalEmptyTileCount = 0;

    // First pass: use reservoir sampling to select count empty tiles
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === EMPTY_TILE_VALUE) {
          totalEmptyTileCount++;

          if (reservoir.length < count) {
            // Fill reservoir if not full
            reservoir.push({row, col});
          } else {
            // Replace element with probability count/totalEmptyTileCount
            const randomIndex = Math.floor(Math.random() * totalEmptyTileCount);
            if (randomIndex < count) {
              reservoir[randomIndex] = {row, col};
            }
          }
        }
      }
    }

    assert.equal(this.emptyTileCount, totalEmptyTileCount);

    // Check if we have enough empty tiles
    if (totalEmptyTileCount < count) {
      return null;
    }

    return reservoir;
  }

  private getRandomNewTileValue(): number {
    return pickRandomElement(NEW_TILE_VALUES);
  }

  private setTileValue(coordinate: Coordinate, value: number) {
    this.gridManager.setTileValue(coordinate, value);
  }
}
