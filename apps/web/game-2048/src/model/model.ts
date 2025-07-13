import assert from 'node:assert';

import {assertIsTest} from '@universal/test-helpers';

import {pickRandomElement} from '@/helpers/random-helpers.js';

import {MoveDirection} from './constants.js';
import type {Coordinate, Movement, OperationMovements} from './types.js';

type NewCellValue = 2 | 4;

class Model {
  private static GRID_SIDE_LENGTH = 4;
  private static EMPTY_CELL_VALUE = 0;
  private static readonly NEW_CELL_VALUES: NewCellValue[] = [2, 4];

  private static getRandomNewCellValue(): NewCellValue {
    return pickRandomElement(this.NEW_CELL_VALUES);
  }

  private grid: number[][] = [];
  private emptyCellCount = -1;

  public getGrid(): readonly (readonly number[])[] {
    return this.grid;
  }

  public init() {
    this.grid = new Array<number[]>(Model.GRID_SIDE_LENGTH);
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array<number>(Model.GRID_SIDE_LENGTH);
      this.grid[i].fill(Model.EMPTY_CELL_VALUE);
    }
    this.emptyCellCount = Model.GRID_SIDE_LENGTH * Model.GRID_SIDE_LENGTH;
    this.createNewNonEmptyCells(2);
  }

  public move(direction: MoveDirection): OperationMovements {
    const operationMovements = this.moveWithoutCreatingNewTile(direction);
    if (
      operationMovements.mergeMovements.length > 0 ||
      operationMovements.compactMovements.length > 0
    ) {
      this.createNewNonEmptyCells(1);
    }

    return operationMovements;
  }

  public moveWithoutCreatingNewTileForTesting(
    direction: MoveDirection,
  ): OperationMovements {
    assertIsTest('moveWithoutCreatingNewNonEmptyCellForTesting');
    return this.moveWithoutCreatingNewTile(direction);
  }

  /**
   * Checks if any moves are possible on the current grid.
   * @returns true if there are empty cells or adjacent cells with same values that can be merged, false otherwise (game over)
   */
  public IsMovable(): boolean {
    if (this.emptyCellCount > 0) {
      return true;
    }

    // Check if any adjacent cells can be merged
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        const cellValue = this.grid[row][col];

        // Check right neighbor
        if (
          col < this.grid[0].length - 1 &&
          this.grid[row][col + 1] === cellValue
        ) {
          return true;
        }

        // Check bottom neighbor
        if (
          row < this.grid.length - 1 &&
          this.grid[row + 1][col] === cellValue
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

  private compactRow(rowIndex: number, toLeft: boolean): Movement[] {
    const rowLength = this.grid[0].length;
    const colStart = toLeft ? 0 : rowLength - 1;
    const colEnd = toLeft ? rowLength : -1;
    const colMoveStep = toLeft ? 1 : -1;

    const movements: Movement[] = [];

    let writeCol = colStart;
    for (let readCol = colStart; readCol !== colEnd; readCol += colMoveStep) {
      if (this.grid[rowIndex][readCol] !== Model.EMPTY_CELL_VALUE) {
        if (writeCol !== readCol) {
          this.grid[rowIndex][writeCol] = this.grid[rowIndex][readCol];
          this.grid[rowIndex][readCol] = Model.EMPTY_CELL_VALUE;

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
      if (this.grid[readRow][colIndex] !== Model.EMPTY_CELL_VALUE) {
        if (writeRow !== readRow) {
          this.grid[writeRow][colIndex] = this.grid[readRow][colIndex];
          this.grid[readRow][colIndex] = Model.EMPTY_CELL_VALUE;

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

  private mergeRow(rowIndex: number, toLeft: boolean): Movement[] {
    const rowLength = this.grid[0].length;
    const colStart = toLeft ? 0 : rowLength - 1;
    const colEnd = toLeft ? rowLength : -1;
    const colMoveStep = toLeft ? 1 : -1;

    const movements: Movement[] = [];

    for (let col = colStart; col !== colEnd; col += colMoveStep) {
      if (this.grid[rowIndex][col] === Model.EMPTY_CELL_VALUE) {
        continue;
      }

      for (
        let nextCol = col + colMoveStep;
        nextCol !== colEnd;
        nextCol += colMoveStep
      ) {
        if (this.grid[rowIndex][nextCol] === Model.EMPTY_CELL_VALUE) {
          continue;
        }
        if (this.grid[rowIndex][nextCol] === this.grid[rowIndex][col]) {
          this.grid[rowIndex][nextCol] = Model.EMPTY_CELL_VALUE;
          this.emptyCellCount++;
          this.grid[rowIndex][col] *= 2;

          movements.push({
            from: {row: rowIndex, col: nextCol},
            to: {row: rowIndex, col},
          });
          break;
        } else {
          // Found different value, impossible to merge. Move to next cell.
          break;
        }
      }
    }
    return movements;
  }

  private createNewNonEmptyCells(count: number) {
    assert(count > 0);
    const emptyCells = this.getRandomEmptyCells(count);
    assert(emptyCells?.length == count, 'No enough empty cells');
    for (const {row, col} of emptyCells) {
      this.grid[row][col] = Model.getRandomNewCellValue();
    }
    this.emptyCellCount -= count;
  }

  /**
   * Use reservoir sampling algorithm to randomly select empty cells.
   * @param count Number of empty cells to select
   * @returns Array of coordinates of empty cells {row, col}. If not enough empty cells, returns null.
   */
  private getRandomEmptyCells(count: number): Coordinate[] | null {
    assert(count > 0);

    const reservoir: Coordinate[] = [];
    let totalEmptyCellCount = 0;

    // First pass: use reservoir sampling to select count empty cells
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === Model.EMPTY_CELL_VALUE) {
          totalEmptyCellCount++;

          if (reservoir.length < count) {
            // Fill reservoir if not full
            reservoir.push({row, col});
          } else {
            // Replace element with probability count/totalEmptyCellCount
            const randomIndex = Math.floor(Math.random() * totalEmptyCellCount);
            if (randomIndex < count) {
              reservoir[randomIndex] = {row, col};
            }
          }
        }
      }
    }

    assert.equal(this.emptyCellCount, totalEmptyCellCount);

    // Check if we have enough empty cells
    if (totalEmptyCellCount < count) {
      return null;
    }

    return reservoir;
  }

  public clearGridForTesting(): void {
    assertIsTest('clearGridForTesting');

    for (let i = 0; i < Model.GRID_SIDE_LENGTH; i++) {
      for (let j = 0; j < Model.GRID_SIDE_LENGTH; j++) {
        this.grid[i][j] = Model.EMPTY_CELL_VALUE;
      }
    }

    this.emptyCellCount = Model.GRID_SIDE_LENGTH * Model.GRID_SIDE_LENGTH;
  }

  public setGridStateForTesting(gridState: number[][]): void {
    assertIsTest('setGridStateForTesting');
    assert(
      gridState.length === Model.GRID_SIDE_LENGTH,
      `Grid must be ${String(Model.GRID_SIDE_LENGTH)}x${String(Model.GRID_SIDE_LENGTH)}`,
    );
    assert(
      gridState.every((row) => row.length === Model.GRID_SIDE_LENGTH),
      `All rows must have ${String(Model.GRID_SIDE_LENGTH)} columns`,
    );

    this.emptyCellCount = Model.GRID_SIDE_LENGTH * Model.GRID_SIDE_LENGTH;

    for (let i = 0; i < Model.GRID_SIDE_LENGTH; i++) {
      for (let j = 0; j < Model.GRID_SIDE_LENGTH; j++) {
        this.grid[i][j] = gridState[i][j];
        if (this.grid[i][j] !== Model.EMPTY_CELL_VALUE) {
          this.emptyCellCount--;
        }
      }
    }
  }

  public getGridSideLengthForTesting(): number {
    assertIsTest('getGridSideLengthForTesting');

    return Model.GRID_SIDE_LENGTH;
  }

  public getEmptyCellValueForTesting(): number {
    assertIsTest('getEmptyCellValueForTesting');

    return Model.EMPTY_CELL_VALUE;
  }

  public getNewCellValuesForTesting(): readonly NewCellValue[] {
    assertIsTest('getNewCellValuesForTesting');

    return Model.NEW_CELL_VALUES;
  }

  public getEmptyCellCountForTesting(): number {
    assertIsTest('getEmptyCellCountForTesting');
    return this.emptyCellCount;
  }

  private mergeCol(colIndex: number, toUp: boolean): Movement[] {
    const colLength = this.grid.length;
    const rowStart = toUp ? 0 : colLength - 1;
    const rowEnd = toUp ? colLength : -1;
    const rowMoveStep = toUp ? 1 : -1;

    const movements: Movement[] = [];

    for (let row = rowStart; row !== rowEnd; row += rowMoveStep) {
      if (this.grid[row][colIndex] === Model.EMPTY_CELL_VALUE) {
        continue;
      }

      for (
        let nextRow = row + rowMoveStep;
        nextRow !== rowEnd;
        nextRow += rowMoveStep
      ) {
        if (this.grid[nextRow][colIndex] === Model.EMPTY_CELL_VALUE) {
          continue;
        }
        if (this.grid[nextRow][colIndex] === this.grid[row][colIndex]) {
          this.grid[nextRow][colIndex] = Model.EMPTY_CELL_VALUE;
          this.emptyCellCount++;
          this.grid[row][colIndex] *= 2;

          movements.push({
            from: {row: nextRow, col: colIndex},
            to: {row, col: colIndex},
          });
          break;
        } else {
          // Found different value, impossible to merge. Move to next cell.
          break;
        }
      }
    }

    return movements;
  }
}

export const model = new Model();
