import assert from 'node:assert';

import {assertIsTest} from '@universal/test-helpers';

import {pickRandomElement} from './helpers/random-helpers.js';

type NewCellValue = 2 | 4;

interface Coordinate {
  row: number;
  col: number;
}

export enum MoveDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

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

  public move(direction: MoveDirection) {
    switch (direction) {
      case MoveDirection.UP:
        this.moveUp();
        break;
      case MoveDirection.DOWN:
        this.moveDown();
        break;
      case MoveDirection.LEFT:
        this.moveLeft();
        break;
      case MoveDirection.RIGHT:
        this.moveRight();
        break;
      default:
        assert.fail(`Unexpected direction ${String(direction)}`);
    }
    this.createNewNonEmptyCells(1);
  }

  private moveUp() {
    for (let col = 0; col < this.grid[0].length; col++) {
      this.mergeCol(col, true);
      this.compactCol(col, true);
    }
  }

  private moveDown() {
    for (let col = 0; col < this.grid[0].length; col++) {
      this.mergeCol(col, false);
      this.compactCol(col, false);
    }
  }

  private moveLeft() {
    for (let row = 0; row < this.grid.length; row++) {
      this.mergeRow(row, true);
      this.compactRow(row, true);
    }
  }

  private moveRight() {
    for (let row = 0; row < this.grid.length; row++) {
      this.mergeRow(row, false);
      this.compactRow(row, false);
    }
  }

  private compactRow(rowIndex: number, toLeft: boolean): void {
    const rowLength = this.grid[0].length;
    const colStart = toLeft ? 0 : rowLength - 1;
    const colEnd = toLeft ? rowLength : -1;
    const colMoveStep = toLeft ? 1 : -1;

    let writeCol = colStart;
    for (let readCol = colStart; readCol !== colEnd; readCol += colMoveStep) {
      if (this.grid[rowIndex][readCol] !== Model.EMPTY_CELL_VALUE) {
        if (writeCol !== readCol) {
          this.grid[rowIndex][writeCol] = this.grid[rowIndex][readCol];
          this.grid[rowIndex][readCol] = Model.EMPTY_CELL_VALUE;
        }
        writeCol += colMoveStep;
      }
    }
  }

  private compactCol(colIndex: number, toUp: boolean): void {
    const colLength = this.grid.length;
    const rowStart = toUp ? 0 : colLength - 1;
    const rowEnd = toUp ? colLength : -1;
    const rowMoveStep = toUp ? 1 : -1;

    let writeRow = rowStart;
    for (let readRow = rowStart; readRow !== rowEnd; readRow += rowMoveStep) {
      if (this.grid[readRow][colIndex] !== Model.EMPTY_CELL_VALUE) {
        if (writeRow !== readRow) {
          this.grid[writeRow][colIndex] = this.grid[readRow][colIndex];
          this.grid[readRow][colIndex] = Model.EMPTY_CELL_VALUE;
        }
        writeRow += rowMoveStep;
      }
    }
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

  private mergeRow(rowIndex: number, toLeft: boolean): void {
    const rowLength = this.grid[0].length;
    const colStart = toLeft ? 0 : rowLength - 1;
    const colEnd = toLeft ? rowLength : -1;
    const colMoveStep = toLeft ? 1 : -1;

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
          break;
        } else {
          // Found different value, impossible to merge. Move to next cell.
          break;
        }
      }
    }
  }

  private mergeCol(colIndex: number, toUp: boolean): void {
    const colLength = this.grid.length;
    const rowStart = toUp ? 0 : colLength - 1;
    const rowEnd = toUp ? colLength : -1;
    const rowMoveStep = toUp ? 1 : -1;

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
          break;
        } else {
          // Found different value, impossible to merge. Move to next cell.
          break;
        }
      }
    }
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

  public moveWithoutCreatingNewNonEmptyCellForTesting(
    direction: MoveDirection,
  ): void {
    assertIsTest('moveWithoutCreatingNewNonEmptyCellForTesting');

    switch (direction) {
      case MoveDirection.UP:
        this.moveUp();
        break;
      case MoveDirection.DOWN:
        this.moveDown();
        break;
      case MoveDirection.LEFT:
        this.moveLeft();
        break;
      case MoveDirection.RIGHT:
        this.moveRight();
        break;
      default:
        assert.fail(`Unexpected direction ${String(direction)}`);
    }
  }
}

export const model = new Model();
