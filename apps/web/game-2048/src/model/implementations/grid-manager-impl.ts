import assert from 'node:assert';

import {assertIsTest} from '@universal/test-helpers';

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

  public resetGrid(): void {
    this.grid = new Array<number[]>(GRID_SIDE_LENGTH);
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array<number>(GRID_SIDE_LENGTH);
      this.grid[i].fill(EMPTY_TILE_VALUE);
    }
    this.emptyTileCount = GRID_SIDE_LENGTH * GRID_SIDE_LENGTH;
  }

  public setTileValue(coordinate: Coordinate, value: number): void {
    const {row, col} = coordinate;
    const oldValue = this.grid[row][col];
    this.grid[row][col] = value;

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
}
