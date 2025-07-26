import {beforeEach, describe, expect, it} from 'vitest';

import {EMPTY_TILE_VALUE, GRID_SIDE_LENGTH} from '@/constants/configs.js';

import {GridManagerImpl} from './grid-manager-impl.js';

describe('GridManagerImpl', () => {
  let gridManager: GridManagerImpl;

  beforeEach(() => {
    gridManager = new GridManagerImpl();
  });

  describe('constructor', () => {
    it('should initialize with empty grid', () => {
      const grid = gridManager.getGrid();
      expect(grid).toHaveLength(GRID_SIDE_LENGTH);
      expect(grid.every((row) => row.length === GRID_SIDE_LENGTH)).toBe(true);
      expect(
        grid.every((row) => row.every((cell) => cell === EMPTY_TILE_VALUE)),
      ).toBe(true);
    });

    it('should initialize with correct empty tile count', () => {
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH,
      );
    });
  });

  describe('getGrid', () => {
    it('should return current grid state', () => {
      gridManager.setTileValue({row: 0, col: 0}, 2);
      const grid = gridManager.getGrid();
      expect(grid[0][0]).toBe(2);
    });
  });

  describe('getEmptyTileCount', () => {
    it('should return initial empty tile count', () => {
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH,
      );
    });

    it('should update when tiles are set', () => {
      gridManager.setTileValue({row: 0, col: 0}, 2);
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH - 1,
      );

      gridManager.setTileValue({row: 1, col: 1}, 4);
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH - 2,
      );
    });

    it('should update when tiles are cleared', () => {
      gridManager.setTileValue({row: 0, col: 0}, 2);
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH - 1,
      );

      gridManager.setTileValue({row: 0, col: 0}, EMPTY_TILE_VALUE);
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH,
      );
    });
  });

  describe('resetGrid', () => {
    it('should reset grid to empty state', () => {
      gridManager.setTileValue({row: 0, col: 0}, 2);
      gridManager.setTileValue({row: 1, col: 1}, 4);

      gridManager.resetGrid();

      const grid = gridManager.getGrid();
      expect(
        grid.every((row) => row.every((cell) => cell === EMPTY_TILE_VALUE)),
      ).toBe(true);
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH,
      );
    });
  });

  describe('setTileValue', () => {
    it('should set tile value correctly', () => {
      gridManager.setTileValue({row: 1, col: 2}, 8);
      const grid = gridManager.getGrid();
      expect(grid[1][2]).toBe(8);
    });

    it('should decrease empty tile count when setting non-empty value', () => {
      const initialCount = gridManager.getEmptyTileCount();
      gridManager.setTileValue({row: 0, col: 0}, 2);
      expect(gridManager.getEmptyTileCount()).toBe(initialCount - 1);
    });

    it('should increase empty tile count when clearing tile', () => {
      gridManager.setTileValue({row: 0, col: 0}, 2);
      const countAfterSet = gridManager.getEmptyTileCount();

      gridManager.setTileValue({row: 0, col: 0}, EMPTY_TILE_VALUE);
      expect(gridManager.getEmptyTileCount()).toBe(countAfterSet + 1);
    });

    it('should not change empty tile count when overwriting non-empty tile', () => {
      gridManager.setTileValue({row: 0, col: 0}, 2);
      const countAfterFirstSet = gridManager.getEmptyTileCount();

      gridManager.setTileValue({row: 0, col: 0}, 4);
      expect(gridManager.getEmptyTileCount()).toBe(countAfterFirstSet);
    });

    it('should handle multiple coordinates', () => {
      gridManager.setTileValue({row: 0, col: 0}, 2);
      gridManager.setTileValue({row: 3, col: 3}, 4);
      gridManager.setTileValue({row: 1, col: 2}, 8);

      const grid = gridManager.getGrid();
      expect(grid[0][0]).toBe(2);
      expect(grid[3][3]).toBe(4);
      expect(grid[1][2]).toBe(8);
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH - 3,
      );
    });
  });

  describe('edge cases', () => {
    it('should handle setting value at all corners', () => {
      gridManager.setTileValue({row: 0, col: 0}, 2);
      gridManager.setTileValue({row: 0, col: GRID_SIDE_LENGTH - 1}, 4);
      gridManager.setTileValue({row: GRID_SIDE_LENGTH - 1, col: 0}, 8);
      gridManager.setTileValue(
        {row: GRID_SIDE_LENGTH - 1, col: GRID_SIDE_LENGTH - 1},
        16,
      );

      const grid = gridManager.getGrid();
      expect(grid[0][0]).toBe(2);
      expect(grid[0][GRID_SIDE_LENGTH - 1]).toBe(4);
      expect(grid[GRID_SIDE_LENGTH - 1][0]).toBe(8);
      expect(grid[GRID_SIDE_LENGTH - 1][GRID_SIDE_LENGTH - 1]).toBe(16);
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH - 4,
      );
    });

    it('should handle setting same coordinate multiple times', () => {
      gridManager.setTileValue({row: 1, col: 1}, 2);
      gridManager.setTileValue({row: 1, col: 1}, 4);
      gridManager.setTileValue({row: 1, col: 1}, 8);

      const grid = gridManager.getGrid();
      expect(grid[1][1]).toBe(8);
      expect(gridManager.getEmptyTileCount()).toBe(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH - 1,
      );
    });
  });
});
