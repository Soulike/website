import assert from 'node:assert';

import {assertIsTest} from '@library/test-helpers';

import {EMPTY_TILE_VALUE, GRID_SIDE_LENGTH} from '@/constants/configs.js';

import type {GridManager} from '../interfaces/grid-manager.js';
import {
  type Coordinate,
  type GridType,
  type ReadOnlyGridType,
} from '../types.js';

export class GridManagerImpl implements GridManager {
  private grid: GridType = [];
  private emptyTileCount = -1;

  constructor() {
    this.resetGrid();
  }

  public getGrid(): ReadOnlyGridType {
    return this.grid;
  }

  public getEmptyTileCount(): number {
    return this.emptyTileCount;
  }

  public getTileValue(coordinate: Coordinate): number {
    const {row, col} = coordinate;
    const gridRow = this.grid[row];
    assert(gridRow !== undefined, `Invalid row index: ${String(row)}`);
    const value = gridRow[col];
    assert(value !== undefined, `Invalid column index: ${String(col)}`);
    return value;
  }

  public resetGrid(): void {
    this.grid = new Array<number[]>(GRID_SIDE_LENGTH);
    for (let i = 0; i < this.grid.length; i++) {
      const row = new Array<number>(GRID_SIDE_LENGTH);
      row.fill(EMPTY_TILE_VALUE);
      this.grid[i] = row;
    }
    this.emptyTileCount = GRID_SIDE_LENGTH * GRID_SIDE_LENGTH;
  }

  public setTileValue(coordinate: Coordinate, value: number): void {
    const {row, col} = coordinate;
    const gridRow = this.grid[row];
    assert(gridRow !== undefined, `Invalid row index: ${String(row)}`);
    const oldValue = gridRow[col];
    assert(oldValue !== undefined, `Invalid column index: ${String(col)}`);
    gridRow[col] = value;

    if (oldValue === EMPTY_TILE_VALUE && value !== EMPTY_TILE_VALUE) {
      this.emptyTileCount--;
    } else if (oldValue !== EMPTY_TILE_VALUE && value === EMPTY_TILE_VALUE) {
      this.emptyTileCount++;
    }
  }

  // Testing methods
  public clearGridForTesting(): void {
    assertIsTest('clearGridForTesting');

    for (let i = 0; i < GRID_SIDE_LENGTH; i++) {
      const gridRow = this.grid[i];
      assert(gridRow !== undefined);
      for (let j = 0; j < GRID_SIDE_LENGTH; j++) {
        gridRow[j] = EMPTY_TILE_VALUE;
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
      const gridRow = this.grid[i];
      const stateRow = gridState[i];
      assert(gridRow !== undefined && stateRow !== undefined);
      for (let j = 0; j < GRID_SIDE_LENGTH; j++) {
        const value = stateRow[j];
        if (value === undefined) {
          assert.fail(
            `Invalid grid state coordinate: (${String(i)}, ${String(j)})`,
          );
        }
        gridRow[j] = value;
        if (value !== EMPTY_TILE_VALUE) {
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
}
