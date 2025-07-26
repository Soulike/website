import {beforeEach, describe, expect, it, vi} from 'vitest';

import {EMPTY_TILE_VALUE, NEW_TILE_VALUES} from '@/constants/configs.js';
import {MovementType} from '@/model/types.js';

import {MoveDirection} from './constants.js';
import {model} from './model.js';

// Empty tile value used in grid literals.
const E = EMPTY_TILE_VALUE;

describe('Model', () => {
  describe('init', () => {
    it('should initialize a 4x4 grid', () => {
      model.init();
      const grid = model.getGrid();
      const gridSize = model.getGridSideLengthForTesting();

      expect(grid).toHaveLength(gridSize);
      grid.forEach((row) => {
        expect(row).toHaveLength(gridSize);
      });
    });

    it('should create exactly 2 non-empty cells after initialization', () => {
      model.init();
      const grid = model.getGrid();

      let nonEmptyCount = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell !== EMPTY_TILE_VALUE) {
            nonEmptyCount++;
          }
        }
      }

      expect(nonEmptyCount).toBe(2);
    });

    it('should create new cells with valid 2048 game values', () => {
      // Run the test multiple times to ensure randomness works properly
      for (let i = 0; i < 10; i++) {
        model.init();
        const grid = model.getGrid();

        const nonEmptyValues: number[] = [];
        for (const row of grid) {
          for (const cell of row) {
            if (cell !== EMPTY_TILE_VALUE) {
              nonEmptyValues.push(cell);
            }
          }
        }

        // Each new cell should be either 2 or 4
        nonEmptyValues.forEach((value) => {
          expect(NEW_TILE_VALUES).toContain(value);
        });

        expect(nonEmptyValues).toHaveLength(2);
      }
    });
  });

  describe('move', () => {
    beforeEach(() => {
      // Create a predictable grid state for testing moves
      model.init();
      model.clearGridForTesting();
    });

    describe('LEFT movement', () => {
      it('should slide tiles to the left', () => {
        // Set up: [0, 2, 0, 4] should become [2, 4, 0, 0]
        model.setGridStateForTesting([
          [E, 2, E, 4],
          [E, E, E, E],
          [E, E, E, E],
          [E, E, E, E],
        ]);

        const movements = model.moveWithoutCreatingNewTileForTesting(
          MoveDirection.LEFT,
        );

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(2);
        expect(newGrid[0][1]).toBe(4);
        expect(newGrid[0][2]).toBe(0);
        expect(newGrid[0][3]).toBe(0);

        // Test movements
        expect(movements.mergeMovements).toHaveLength(0);
        expect(movements.compactMovements).toHaveLength(2);
        expect(movements.compactMovements).toContainEqual({
          from: {row: 0, col: 1},
          to: {row: 0, col: 0},
          type: MovementType.COMPACT,
        });
        expect(movements.compactMovements).toContainEqual({
          from: {row: 0, col: 3},
          to: {row: 0, col: 1},
          type: MovementType.COMPACT,
        });
      });

      it('should merge adjacent tiles with same value', () => {
        // Set up: [2, 2, 0, 0] should become [4, 0, 0, 0]
        model.setGridStateForTesting([
          [2, 2, E, E],
          [E, E, E, E],
          [E, E, E, E],
          [E, E, E, E],
        ]);

        const movements = model.moveWithoutCreatingNewTileForTesting(
          MoveDirection.LEFT,
        );

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(4);
        expect(newGrid[0][1]).toBe(0);
        expect(newGrid[0][2]).toBe(0);
        expect(newGrid[0][3]).toBe(0);

        // Test movements
        expect(movements.mergeMovements).toHaveLength(1);
        expect(movements.compactMovements).toHaveLength(0);
        expect(movements.mergeMovements[0]).toEqual({
          from: {row: 0, col: 1},
          to: {row: 0, col: 0},
          type: MovementType.MERGE,
        });
      });

      it('should merge tiles and then slide', () => {
        // Set up: [2, 2, 4, 4] should become [4, 8, 0, 0]
        model.setGridStateForTesting([
          [2, 2, 4, 4],
          [E, E, E, E],
          [E, E, E, E],
          [E, E, E, E],
        ]);

        const movements = model.moveWithoutCreatingNewTileForTesting(
          MoveDirection.LEFT,
        );

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(4);
        expect(newGrid[0][1]).toBe(8);
        expect(newGrid[0][2]).toBe(0);
        expect(newGrid[0][3]).toBe(0);

        // Test movements
        expect(movements.mergeMovements).toHaveLength(2);
        expect(movements.compactMovements).toHaveLength(0);

        // Merge movements
        expect(movements.mergeMovements).toContainEqual({
          from: {row: 0, col: 1},
          to: {row: 0, col: 0},
          type: MovementType.MERGE,
        });
        expect(movements.mergeMovements).toContainEqual({
          from: {row: 0, col: 3},
          to: {row: 0, col: 1},
          type: MovementType.MERGE,
        });
      });
    });

    describe('RIGHT movement', () => {
      it('should slide tiles to the right', () => {
        // Set up: [2, 0, 4, 0] should become [0, 0, 2, 4]
        model.setGridStateForTesting([
          [2, E, 4, E],
          [E, E, E, E],
          [E, E, E, E],
          [E, E, E, E],
        ]);

        const movements = model.moveWithoutCreatingNewTileForTesting(
          MoveDirection.RIGHT,
        );

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(0);
        expect(newGrid[0][1]).toBe(0);
        expect(newGrid[0][2]).toBe(2);
        expect(newGrid[0][3]).toBe(4);

        // Test movements
        expect(movements.mergeMovements).toHaveLength(0);
        expect(movements.compactMovements).toHaveLength(2);
        expect(movements.compactMovements).toContainEqual({
          from: {row: 0, col: 0},
          to: {row: 0, col: 2},
          type: MovementType.COMPACT,
        });
        expect(movements.compactMovements).toContainEqual({
          from: {row: 0, col: 2},
          to: {row: 0, col: 3},
          type: MovementType.COMPACT,
        });
      });

      it('should merge tiles from right to left', () => {
        // Set up: [0, 0, 2, 2] should become [0, 0, 0, 4]
        model.setGridStateForTesting([
          [E, E, 2, 2],
          [E, E, E, E],
          [E, E, E, E],
          [E, E, E, E],
        ]);

        const movements = model.moveWithoutCreatingNewTileForTesting(
          MoveDirection.RIGHT,
        );

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(0);
        expect(newGrid[0][1]).toBe(0);
        expect(newGrid[0][2]).toBe(0);
        expect(newGrid[0][3]).toBe(4);

        // Test movements
        expect(movements.mergeMovements).toHaveLength(1);
        expect(movements.compactMovements).toHaveLength(0);
        expect(movements.mergeMovements[0]).toEqual({
          from: {row: 0, col: 2},
          to: {row: 0, col: 3},
          type: MovementType.MERGE,
        });
      });
    });

    describe('UP movement', () => {
      it('should slide tiles up', () => {
        // Set up column: [0, 2, 0, 4] should become [2, 4, 0, 0]
        model.setGridStateForTesting([
          [E, E, E, E],
          [2, E, E, E],
          [E, E, E, E],
          [4, E, E, E],
        ]);

        const movements = model.moveWithoutCreatingNewTileForTesting(
          MoveDirection.UP,
        );

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(2);
        expect(newGrid[1][0]).toBe(4);
        expect(newGrid[2][0]).toBe(0);
        expect(newGrid[3][0]).toBe(0);

        // Test movements
        expect(movements.mergeMovements).toHaveLength(0);
        expect(movements.compactMovements).toHaveLength(2);
        expect(movements.compactMovements).toContainEqual({
          from: {row: 1, col: 0},
          to: {row: 0, col: 0},
          type: MovementType.COMPACT,
        });
        expect(movements.compactMovements).toContainEqual({
          from: {row: 3, col: 0},
          to: {row: 1, col: 0},
          type: MovementType.COMPACT,
        });
      });

      it('should merge tiles vertically', () => {
        // Set up column: [2, 2, 0, 0] should become [4, 0, 0, 0]
        model.setGridStateForTesting([
          [2, E, E, E],
          [2, E, E, E],
          [E, E, E, E],
          [E, E, E, E],
        ]);

        const movements = model.moveWithoutCreatingNewTileForTesting(
          MoveDirection.UP,
        );

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(4);
        expect(newGrid[1][0]).toBe(0);
        expect(newGrid[2][0]).toBe(0);
        expect(newGrid[3][0]).toBe(0);

        // Test movements
        expect(movements.mergeMovements).toHaveLength(1);
        expect(movements.compactMovements).toHaveLength(0);
        expect(movements.mergeMovements[0]).toEqual({
          from: {row: 1, col: 0},
          to: {row: 0, col: 0},
          type: MovementType.MERGE,
        });
      });
    });

    describe('DOWN movement', () => {
      it('should slide tiles down', () => {
        // Set up column: [2, 0, 4, 0] should become [0, 0, 2, 4]
        model.setGridStateForTesting([
          [2, E, E, E],
          [E, E, E, E],
          [4, E, E, E],
          [E, E, E, E],
        ]);

        const movements = model.moveWithoutCreatingNewTileForTesting(
          MoveDirection.DOWN,
        );

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(0);
        expect(newGrid[1][0]).toBe(0);
        expect(newGrid[2][0]).toBe(2);
        expect(newGrid[3][0]).toBe(4);

        // Test movements
        expect(movements.mergeMovements).toHaveLength(0);
        expect(movements.compactMovements).toHaveLength(2);
        expect(movements.compactMovements).toContainEqual({
          from: {row: 0, col: 0},
          to: {row: 2, col: 0},
          type: MovementType.COMPACT,
        });
        expect(movements.compactMovements).toContainEqual({
          from: {row: 2, col: 0},
          to: {row: 3, col: 0},
          type: MovementType.COMPACT,
        });
      });

      it('should merge tiles from bottom up', () => {
        // Set up column: [0, 0, 2, 2] should become [0, 0, 0, 4]
        model.setGridStateForTesting([
          [E, E, E, E],
          [E, E, E, E],
          [2, E, E, E],
          [2, E, E, E],
        ]);

        const movements = model.moveWithoutCreatingNewTileForTesting(
          MoveDirection.DOWN,
        );

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(0);
        expect(newGrid[1][0]).toBe(0);
        expect(newGrid[2][0]).toBe(0);
        expect(newGrid[3][0]).toBe(4);

        // Test movements
        expect(movements.mergeMovements).toHaveLength(1);
        expect(movements.compactMovements).toHaveLength(0);
        expect(movements.mergeMovements[0]).toEqual({
          from: {row: 2, col: 0},
          to: {row: 3, col: 0},
          type: MovementType.MERGE,
        });
      });
    });

    it('should spawn exactly one new tile after each move', () => {
      // Set up a grid with many empty cells
      model.setGridStateForTesting([
        [E, 2, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      const initialNonEmptyCount = 1;

      const movements = model.move(MoveDirection.LEFT);

      const newGrid = model.getGrid();
      let newNonEmptyCount = 0;
      for (const row of newGrid) {
        for (const cell of row) {
          if (cell !== EMPTY_TILE_VALUE) {
            newNonEmptyCount++;
          }
        }
      }

      expect(newNonEmptyCount).toBe(initialNonEmptyCount + 1);

      // Test movements - the tile should move from column 1 to column 0
      expect(movements.mergeMovements).toHaveLength(0);
      expect(movements.compactMovements).toHaveLength(1);
      expect(movements.compactMovements[0]).toEqual({
        from: {row: 0, col: 1},
        to: {row: 0, col: 0},
        type: MovementType.COMPACT,
      });
    });

    it('should spawn no new tile if no tile is moved', () => {
      // Set up a grid with many empty cells
      model.setGridStateForTesting([
        [E, 2, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      const initialNonEmptyCount = 1;

      const movements = model.move(MoveDirection.UP);

      const newGrid = model.getGrid();
      let newNonEmptyCount = 0;
      for (const row of newGrid) {
        for (const cell of row) {
          if (cell !== EMPTY_TILE_VALUE) {
            newNonEmptyCount++;
          }
        }
      }

      expect(newNonEmptyCount).toBe(initialNonEmptyCount);

      // Test movements - no movements should occur since the tile is already at the top
      expect(movements.mergeMovements).toHaveLength(0);
      expect(movements.compactMovements).toHaveLength(0);
    });

    it('should create new tiles with valid 2048 game values after move', () => {
      // Test multiple times to ensure randomness works properly
      for (let i = 0; i < 10; i++) {
        model.setGridStateForTesting([
          [E, 2, E, E],
          [E, E, E, E],
          [E, E, E, E],
          [E, E, E, E],
        ]);

        const movements = model.move(MoveDirection.LEFT);
        const grid = model.getGrid();

        // Find the new tile that was added after the move
        let newTileValue: number | null = null;
        let foundTiles = 0;

        for (const row of grid) {
          for (const cell of row) {
            if (cell !== EMPTY_TILE_VALUE) {
              foundTiles++;
              if (foundTiles === 2) {
                // This is the new tile (first tile is the original 2)
                newTileValue = cell;
              }
            }
          }
        }

        // Only one new tile created.
        expect(foundTiles).toEqual(2);
        // The new tile should be a valid 2048 game value
        expect(newTileValue).not.toBeNull();
        if (newTileValue !== null) {
          expect(NEW_TILE_VALUES).toContain(newTileValue);
        }

        // Test movements - should have one compact movement
        expect(movements.mergeMovements).toHaveLength(0);
        expect(movements.compactMovements).toHaveLength(1);
        expect(movements.compactMovements[0]).toEqual({
          from: {row: 0, col: 1},
          to: {row: 0, col: 0},
          type: MovementType.COMPACT,
        });
      }
    });
  });

  describe('complex game scenarios', () => {
    beforeEach(() => {
      model.init();
      model.clearGridForTesting();
    });

    it('should handle multiple merges in one move', () => {
      // Set up: [2, 2, 4, 4] -> LEFT -> [4, 8, 0, 0]
      model.setGridStateForTesting([
        [2, 2, 4, 4],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      const movements = model.moveWithoutCreatingNewTileForTesting(
        MoveDirection.LEFT,
      );

      const newGrid = model.getGrid();
      expect(newGrid[0][0]).toBe(4);
      expect(newGrid[0][1]).toBe(8);
      expect(newGrid[0][2]).toBe(0);
      expect(newGrid[0][3]).toBe(0);

      // Test movements
      expect(movements.mergeMovements).toHaveLength(2);
      expect(movements.compactMovements).toHaveLength(0);

      // Check merge movements
      expect(movements.mergeMovements).toContainEqual({
        from: {row: 0, col: 1},
        to: {row: 0, col: 0},
        type: MovementType.MERGE,
      });
      expect(movements.mergeMovements).toContainEqual({
        from: {row: 0, col: 3},
        to: {row: 0, col: 1},
        type: MovementType.MERGE,
      });
    });

    it('should not merge tiles twice in one move', () => {
      // Set up: [4, 2, 2, 0] -> LEFT -> [4, 4, 0, 0] (not [8, 0, 0, 0])
      model.setGridStateForTesting([
        [4, 2, 2, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      const movements = model.moveWithoutCreatingNewTileForTesting(
        MoveDirection.LEFT,
      );

      const newGrid = model.getGrid();
      expect(newGrid[0][0]).toBe(4);
      expect(newGrid[0][1]).toBe(4);
      expect(newGrid[0][2]).toBe(0);
      expect(newGrid[0][3]).toBe(0);

      // Test movements - should have one merge and no compact
      expect(movements.mergeMovements).toHaveLength(1);
      expect(movements.compactMovements).toHaveLength(0);

      // The two 2's merge together
      expect(movements.mergeMovements[0]).toEqual({
        from: {row: 0, col: 2},
        to: {row: 0, col: 1},
        type: MovementType.MERGE,
      });
    });

    it('should handle full grid scenarios', () => {
      // Test with a nearly full grid
      model.setGridStateForTesting([
        [2, 4, 8, 16],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, E], // One empty cell
      ]);

      const movements = model.move(MoveDirection.RIGHT);

      // Verify that the move was processed and exactly one new tile was added
      const emptyCount = model.getEmptyTileCountForTesting();

      expect(emptyCount).toBe(0); // All cells should be filled after the move

      // Test movements - no merges should happen with this configuration
      expect(movements.mergeMovements).toHaveLength(0);
      expect(movements.compactMovements).toHaveLength(3);
    });
  });

  describe('IsMovable', () => {
    beforeEach(() => {
      model.init();
      model.clearGridForTesting();
    });

    it('should return true when there are empty cells', () => {
      // Set up a grid with some empty cells
      model.setGridStateForTesting([
        [2, 4, E, E],
        [4, 2, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      expect(model.isMovable()).toBe(true);
    });

    it('should return true when adjacent horizontal cells can be merged', () => {
      // Set up a full grid with mergeable horizontal neighbors
      model.setGridStateForTesting([
        [2, 2, 4, 8],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ]);

      expect(model.isMovable()).toBe(true);
    });

    it('should return true when adjacent vertical cells can be merged', () => {
      // Set up a full grid with mergeable vertical neighbors
      model.setGridStateForTesting([
        [2, 4, 8, 16],
        [2, 8, 16, 32],
        [4, 16, 32, 64],
        [8, 32, 64, 128],
      ]);

      expect(model.isMovable()).toBe(true);
    });

    it('should return true when cells can be merged in multiple directions', () => {
      // Set up a grid with both horizontal and vertical merges possible
      model.setGridStateForTesting([
        [2, 2, 4, 8],
        [4, 4, 8, 16],
        [8, 8, 16, 32],
        [16, 32, 64, 128],
      ]);

      expect(model.isMovable()).toBe(true);
    });

    it('should return false when no moves are possible (game over)', () => {
      // Set up a grid where no adjacent cells can be merged
      model.setGridStateForTesting([
        [2, 4, 8, 16],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ]);

      expect(model.isMovable()).toBe(false);
    });

    it('should return false for another game over scenario', () => {
      // Another pattern where no moves are possible
      model.setGridStateForTesting([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]);

      expect(model.isMovable()).toBe(false);
    });

    it('should return true when merge is possible at grid edges', () => {
      // Test merge possibility at the rightmost edge
      model.setGridStateForTesting([
        [2, 4, 8, 8],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ]);

      expect(model.isMovable()).toBe(true);
    });

    it('should return true when merge is possible at grid bottom edge', () => {
      // Test merge possibility at the bottom edge
      model.setGridStateForTesting([
        [2, 4, 8, 16],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [8, 32, 64, 128],
      ]);

      expect(model.isMovable()).toBe(true);
    });

    it('should return true when only one merge is possible', () => {
      // Test with minimal merging opportunity
      model.setGridStateForTesting([
        [2, 4, 8, 16],
        [4, 8, 16, 32],
        [8, 16, 16, 64], // Only these two 16s can merge
        [16, 32, 64, 128],
      ]);

      expect(model.isMovable()).toBe(true);
    });
  });

  describe('score tracking', () => {
    beforeEach(() => {
      model.init();
      model.clearGridForTesting();
    });

    it('should initialize score to 0 on game init', () => {
      model.init();
      expect(model.getScore()).toBe(0);
    });

    it('should return current score via getScore method', () => {
      model.init();
      const score = model.getScore();
      expect(typeof score).toBe('number');
      expect(score).toBe(0);
    });

    it('should increase score when tiles merge horizontally', () => {
      // Set up: [2, 2, 0, 0] - merging should add 4 to score
      model.setGridStateForTesting([
        [2, 2, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      const initialScore = model.getScore();
      model.moveWithoutCreatingNewTileForTesting(MoveDirection.LEFT);

      expect(model.getScore()).toBe(initialScore + 4);
    });

    it('should increase score when tiles merge vertically', () => {
      // Set up: vertical [4, 4] - merging should add 8 to score
      model.setGridStateForTesting([
        [4, E, E, E],
        [4, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      const initialScore = model.getScore();
      model.moveWithoutCreatingNewTileForTesting(MoveDirection.UP);

      expect(model.getScore()).toBe(initialScore + 8);
    });

    it('should accumulate score from multiple merges in one move', () => {
      // Set up: [2, 2, 4, 4] - should merge to [4, 8] and add 4 + 8 = 12 to score
      model.setGridStateForTesting([
        [2, 2, 4, 4],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      const initialScore = model.getScore();
      model.moveWithoutCreatingNewTileForTesting(MoveDirection.LEFT);

      expect(model.getScore()).toBe(initialScore + 12);
    });

    it('should not increase score when only compacting tiles', () => {
      // Set up: [2, 0, 4, 0] - only sliding, no merging
      model.setGridStateForTesting([
        [2, E, 4, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      const initialScore = model.getScore();
      model.moveWithoutCreatingNewTileForTesting(MoveDirection.LEFT);

      expect(model.getScore()).toBe(initialScore);
    });

    it('should emit scoreChange event when score increases', () => {
      const mockListener = vi.fn();
      model.on('scoreChange', mockListener);

      model.setGridStateForTesting([
        [2, 2, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      model.moveWithoutCreatingNewTileForTesting(MoveDirection.LEFT);

      expect(mockListener).toHaveBeenCalledWith(4);
      model.off('scoreChange', mockListener);
    });

    it('should emit scoreChange event when score resets to 0', () => {
      // First, increase score
      model.setGridStateForTesting([
        [2, 2, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);
      model.moveWithoutCreatingNewTileForTesting(MoveDirection.LEFT);
      expect(model.getScore()).toBe(4);

      // Then test reset
      const mockListener = vi.fn();
      model.on('scoreChange', mockListener);

      model.init();

      expect(mockListener).toHaveBeenCalledWith(0);
      expect(model.getScore()).toBe(0);
      model.off('scoreChange', mockListener);
    });

    it('should handle large score values correctly', () => {
      // Set up high-value tiles: [512, 512] - should add 1024 to score
      model.setGridStateForTesting([
        [512, 512, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);

      const initialScore = model.getScore();
      model.moveWithoutCreatingNewTileForTesting(MoveDirection.LEFT);

      expect(model.getScore()).toBe(initialScore + 1024);
    });

    it('should maintain score across multiple moves', () => {
      let expectedScore = 0;

      // First merge: [2, 2] -> 4 points
      model.setGridStateForTesting([
        [2, 2, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);
      model.moveWithoutCreatingNewTileForTesting(MoveDirection.LEFT);
      expectedScore += 4;
      expect(model.getScore()).toBe(expectedScore);

      // Second merge: [4, 4] -> 8 more points
      model.setGridStateForTesting([
        [4, 4, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ]);
      model.moveWithoutCreatingNewTileForTesting(MoveDirection.LEFT);
      expectedScore += 8;
      expect(model.getScore()).toBe(expectedScore);
    });
  });
});
