import assert from 'node:assert';

import {assertIsTest} from '@universal/test-helpers';

import {
  EMPTY_TILE_VALUE,
  GRID_SIDE_LENGTH,
  NEW_TILE_VALUES,
} from '@/constants/configs.js';
import {pickRandomElement} from '@/helpers/random-helpers.js';

import {MoveDirection} from './constants.js';
import type {
  Coordinate,
  GridChangeEventListener,
  Movement,
  OperationMovements,
} from './types.js';

class Model {
  private emptyTileCount = -1;

  private grid: number[][] = [];
  private gridChangeEventListeners = new Set<GridChangeEventListener>();

  private static getRandomNewTileValue() {
    return pickRandomElement(NEW_TILE_VALUES);
  }

  public getGrid(): readonly (readonly number[])[] {
    return this.grid;
  }

  public onGridChange(listener: GridChangeEventListener) {
    this.gridChangeEventListeners.add(listener);
  }

  public offGridChange(listener: GridChangeEventListener) {
    this.gridChangeEventListeners.delete(listener);
  }

  public move(direction: MoveDirection): OperationMovements {
    const operationMovements = this.moveWithoutCreatingNewTile(direction);
    if (
      operationMovements.mergeMovements.length > 0 ||
      operationMovements.compactMovements.length > 0
    ) {
      this.createNewTile(1);
      this.triggerGridChangeEventListeners();
    }

    return operationMovements;
  }

  public init() {
    this.grid = new Array<number[]>(GRID_SIDE_LENGTH);
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array<number>(GRID_SIDE_LENGTH);
      this.grid[i].fill(EMPTY_TILE_VALUE);
    }
    this.emptyTileCount = GRID_SIDE_LENGTH * GRID_SIDE_LENGTH;
    this.createNewTile(2);
  }

  private triggerGridChangeEventListeners() {
    for (const listener of this.gridChangeEventListeners) {
      listener(this.grid);
    }
  }

  public moveWithoutCreatingNewTileForTesting(
    direction: MoveDirection,
  ): OperationMovements {
    assertIsTest('moveWithoutCreatingNewTileForTesting');
    return this.moveWithoutCreatingNewTile(direction);
  }

  /**
   * Checks if any moves are possible on the current grid.
   * @returns true if there are empty tiles or adjacent tiles with same values that can be merged, false otherwise (game over)
   */
  public IsMovable(): boolean {
    if (this.emptyTileCount > 0) {
      return true;
    }

    // Check if any adjacent tiles can be merged
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        const tileValue = this.grid[row][col];

        // Check right neighbor
        if (
          col < this.grid[0].length - 1 &&
          this.grid[row][col + 1] === tileValue
        ) {
          return true;
        }

        // Check bottom neighbor
        if (
          row < this.grid.length - 1 &&
          this.grid[row + 1][col] === tileValue
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private moveWithoutCreatingNewTile(direction: MoveDirection) {
    assert(this.IsMovable(), 'Try to move after game is over.');

    let operationMovements: OperationMovements | null = null;

    switch (direction) {
      case MoveDirection.UP:
        operationMovements = this.moveUp();
        break;
      case MoveDirection.DOWN:
        operationMovements = this.moveDown();
        break;
      case MoveDirection.LEFT:
        operationMovements = this.moveLeft();
        break;
      case MoveDirection.RIGHT:
        operationMovements = this.moveRight();
        break;
      default:
        assert.fail(`Unexpected direction ${String(direction)}`);
    }

    return operationMovements;
  }

  private moveUp(): OperationMovements {
    const mergeMovements: Movement[] = [];
    const compactMovements: Movement[] = [];

    for (let col = 0; col < this.grid[0].length; col++) {
      mergeMovements.push(...this.mergeCol(col, true));
      compactMovements.push(...this.compactCol(col, true));
    }

    return {mergeMovements, compactMovements};
  }

  private moveDown(): OperationMovements {
    const mergeMovements: Movement[] = [];
    const compactMovements: Movement[] = [];

    for (let col = 0; col < this.grid[0].length; col++) {
      mergeMovements.push(...this.mergeCol(col, false));
      compactMovements.push(...this.compactCol(col, false));
    }

    return {mergeMovements, compactMovements};
  }

  private moveLeft(): OperationMovements {
    const mergeMovements: Movement[] = [];
    const compactMovements: Movement[] = [];

    for (let row = 0; row < this.grid.length; row++) {
      mergeMovements.push(...this.mergeRow(row, true));
      compactMovements.push(...this.compactRow(row, true));
    }

    return {mergeMovements, compactMovements};
  }

  private moveRight(): OperationMovements {
    const mergeMovements: Movement[] = [];
    const compactMovements: Movement[] = [];

    for (let row = 0; row < this.grid.length; row++) {
      mergeMovements.push(...this.mergeRow(row, false));
      compactMovements.push(...this.compactRow(row, false));
    }

    return {mergeMovements, compactMovements};
  }

  public clearGridForTesting(): void {
    assertIsTest('clearGridForTesting');

    for (let i = 0; i < GRID_SIDE_LENGTH; i++) {
      for (let j = 0; j < GRID_SIDE_LENGTH; j++) {
        this.grid[i][j] = EMPTY_TILE_VALUE;
      }
    }

    this.emptyTileCount = GRID_SIDE_LENGTH * GRID_SIDE_LENGTH;
  }

  public setGridStateForTesting(gridState: number[][]): void {
    assertIsTest('setGridStateForTesting');
    assert(
      gridState.length === GRID_SIDE_LENGTH,
      `Grid must be ${String(GRID_SIDE_LENGTH)}x${String(GRID_SIDE_LENGTH)}`,
    );
    assert(
      gridState.every((row) => row.length === GRID_SIDE_LENGTH),
      `All rows must have ${String(GRID_SIDE_LENGTH)} columns`,
    );

    this.emptyTileCount = GRID_SIDE_LENGTH * GRID_SIDE_LENGTH;

    for (let i = 0; i < GRID_SIDE_LENGTH; i++) {
      for (let j = 0; j < GRID_SIDE_LENGTH; j++) {
        this.grid[i][j] = gridState[i][j];
        if (this.grid[i][j] !== EMPTY_TILE_VALUE) {
          this.emptyTileCount--;
        }
      }
    }
  }

  public getGridSideLengthForTesting(): number {
    assertIsTest('getGridSideLengthForTesting');

    return GRID_SIDE_LENGTH;
  }

  public getEmptyTileCountForTesting(): number {
    assertIsTest('getEmptyTileCountForTesting');
    return this.emptyTileCount;
  }

  private compactRow(rowIndex: number, toLeft: boolean): Movement[] {
    const rowLength = this.grid[0].length;
    const colStart = toLeft ? 0 : rowLength - 1;
    const colEnd = toLeft ? rowLength : -1;
    const colMoveStep = toLeft ? 1 : -1;

    const movements: Movement[] = [];

    let writeCol = colStart;
    for (let readCol = colStart; readCol !== colEnd; readCol += colMoveStep) {
      if (this.grid[rowIndex][readCol] !== EMPTY_TILE_VALUE) {
        if (writeCol !== readCol) {
          this.grid[rowIndex][writeCol] = this.grid[rowIndex][readCol];
          this.grid[rowIndex][readCol] = EMPTY_TILE_VALUE;

          movements.push({
            from: {row: rowIndex, col: readCol},
            to: {row: rowIndex, col: writeCol},
          });
        }
        writeCol += colMoveStep;
      }
    }

    return movements;
  }

  private compactCol(colIndex: number, toUp: boolean): Movement[] {
    const colLength = this.grid.length;
    const rowStart = toUp ? 0 : colLength - 1;
    const rowEnd = toUp ? colLength : -1;
    const rowMoveStep = toUp ? 1 : -1;

    const movements: Movement[] = [];

    let writeRow = rowStart;
    for (let readRow = rowStart; readRow !== rowEnd; readRow += rowMoveStep) {
      if (this.grid[readRow][colIndex] !== EMPTY_TILE_VALUE) {
        if (writeRow !== readRow) {
          this.grid[writeRow][colIndex] = this.grid[readRow][colIndex];
          this.grid[readRow][colIndex] = EMPTY_TILE_VALUE;

          movements.push({
            from: {row: readRow, col: colIndex},
            to: {row: writeRow, col: colIndex},
          });
        }
        writeRow += rowMoveStep;
      }
    }

    return movements;
  }

  private createNewTile(count: number) {
    assert(count > 0);
    const emptyTiles = this.getRandomEmptyTiles(count);
    assert(emptyTiles?.length == count, 'No enough empty tiles');
    for (const {row, col} of emptyTiles) {
      this.grid[row][col] = Model.getRandomNewTileValue();
    }
    this.emptyTileCount -= count;
  }

  private mergeRow(rowIndex: number, toLeft: boolean): Movement[] {
    const rowLength = this.grid[0].length;
    const colStart = toLeft ? 0 : rowLength - 1;
    const colEnd = toLeft ? rowLength : -1;
    const colMoveStep = toLeft ? 1 : -1;

    const movements: Movement[] = [];

    for (let col = colStart; col !== colEnd; col += colMoveStep) {
      if (this.grid[rowIndex][col] === EMPTY_TILE_VALUE) {
        continue;
      }

      for (
        let nextCol = col + colMoveStep;
        nextCol !== colEnd;
        nextCol += colMoveStep
      ) {
        if (this.grid[rowIndex][nextCol] === EMPTY_TILE_VALUE) {
          continue;
        }
        if (this.grid[rowIndex][nextCol] === this.grid[rowIndex][col]) {
          this.grid[rowIndex][nextCol] = EMPTY_TILE_VALUE;
          this.emptyTileCount++;
          this.grid[rowIndex][col] *= 2;

          movements.push({
            from: {row: rowIndex, col: nextCol},
            to: {row: rowIndex, col},
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

  private mergeCol(colIndex: number, toUp: boolean): Movement[] {
    const colLength = this.grid.length;
    const rowStart = toUp ? 0 : colLength - 1;
    const rowEnd = toUp ? colLength : -1;
    const rowMoveStep = toUp ? 1 : -1;

    const movements: Movement[] = [];

    for (let row = rowStart; row !== rowEnd; row += rowMoveStep) {
      if (this.grid[row][colIndex] === EMPTY_TILE_VALUE) {
        continue;
      }

      for (
        let nextRow = row + rowMoveStep;
        nextRow !== rowEnd;
        nextRow += rowMoveStep
      ) {
        if (this.grid[nextRow][colIndex] === EMPTY_TILE_VALUE) {
          continue;
        }
        if (this.grid[nextRow][colIndex] === this.grid[row][colIndex]) {
          this.grid[nextRow][colIndex] = EMPTY_TILE_VALUE;
          this.emptyTileCount++;
          this.grid[row][colIndex] *= 2;

          movements.push({
            from: {row: nextRow, col: colIndex},
            to: {row, col: colIndex},
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
}

export const model = new Model();
