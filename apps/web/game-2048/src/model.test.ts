import {beforeEach, describe, expect, it} from 'vitest';

import {model, MoveDirection} from './model.js';

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
      const emptyCellValue = model.getEmptyCellValueForTesting();

      let nonEmptyCount = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell !== emptyCellValue) {
            nonEmptyCount++;
          }
        }
      }

      expect(nonEmptyCount).toBe(2);
    });

    it('should create new cells with valid 2048 game values', () => {
      const validValues = model.getNewCellValuesForTesting();

      // Run the test multiple times to ensure randomness works properly
      for (let i = 0; i < 10; i++) {
        model.init();
        const grid = model.getGrid();
        const emptyCellValue = model.getEmptyCellValueForTesting();

        const nonEmptyValues: number[] = [];
        for (const row of grid) {
          for (const cell of row) {
            if (cell !== emptyCellValue) {
              nonEmptyValues.push(cell);
            }
          }
        }

        // Each new cell should be either 2 or 4
        nonEmptyValues.forEach((value) => {
          expect(validValues).toContain(value);
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
          [0, 2, 0, 4],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.LEFT);

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(2);
        expect(newGrid[0][1]).toBe(4);
        expect(newGrid[0][2]).toBe(0);
        expect(newGrid[0][3]).toBe(0);
      });

      it('should merge adjacent tiles with same value', () => {
        // Set up: [2, 2, 0, 0] should become [4, 0, 0, 0]
        model.setGridStateForTesting([
          [2, 2, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.LEFT);

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(4);
        expect(newGrid[0][1]).toBe(0);
        expect(newGrid[0][2]).toBe(0);
        expect(newGrid[0][3]).toBe(0);
      });

      it('should merge tiles and then slide', () => {
        // Set up: [2, 2, 4, 4] should become [4, 8, 0, 0]
        model.setGridStateForTesting([
          [2, 2, 4, 4],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.LEFT);

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(4);
        expect(newGrid[0][1]).toBe(8);
        expect(newGrid[0][2]).toBe(0);
        expect(newGrid[0][3]).toBe(0);
      });
    });

    describe('RIGHT movement', () => {
      it('should slide tiles to the right', () => {
        // Set up: [2, 0, 4, 0] should become [0, 0, 2, 4]
        model.setGridStateForTesting([
          [2, 0, 4, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.RIGHT);

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(0);
        expect(newGrid[0][1]).toBe(0);
        expect(newGrid[0][2]).toBe(2);
        expect(newGrid[0][3]).toBe(4);
      });

      it('should merge tiles from right to left', () => {
        // Set up: [0, 0, 2, 2] should become [0, 0, 0, 4]
        model.setGridStateForTesting([
          [0, 0, 2, 2],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.RIGHT);

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(0);
        expect(newGrid[0][1]).toBe(0);
        expect(newGrid[0][2]).toBe(0);
        expect(newGrid[0][3]).toBe(4);
      });
    });

    describe('UP movement', () => {
      it('should slide tiles up', () => {
        // Set up column: [0, 2, 0, 4] should become [2, 4, 0, 0]
        model.setGridStateForTesting([
          [0, 0, 0, 0],
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [4, 0, 0, 0],
        ]);

        model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.UP);

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(2);
        expect(newGrid[1][0]).toBe(4);
        expect(newGrid[2][0]).toBe(0);
        expect(newGrid[3][0]).toBe(0);
      });

      it('should merge tiles vertically', () => {
        // Set up column: [2, 2, 0, 0] should become [4, 0, 0, 0]
        model.setGridStateForTesting([
          [2, 0, 0, 0],
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.UP);

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(4);
        expect(newGrid[1][0]).toBe(0);
        expect(newGrid[2][0]).toBe(0);
        expect(newGrid[3][0]).toBe(0);
      });
    });

    describe('DOWN movement', () => {
      it('should slide tiles down', () => {
        // Set up column: [2, 0, 4, 0] should become [0, 0, 2, 4]
        model.setGridStateForTesting([
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [4, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.DOWN);

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(0);
        expect(newGrid[1][0]).toBe(0);
        expect(newGrid[2][0]).toBe(2);
        expect(newGrid[3][0]).toBe(4);
      });

      it('should merge tiles from bottom up', () => {
        // Set up column: [0, 0, 2, 2] should become [0, 0, 0, 4]
        model.setGridStateForTesting([
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [2, 0, 0, 0],
          [2, 0, 0, 0],
        ]);

        model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.DOWN);

        const newGrid = model.getGrid();
        expect(newGrid[0][0]).toBe(0);
        expect(newGrid[1][0]).toBe(0);
        expect(newGrid[2][0]).toBe(0);
        expect(newGrid[3][0]).toBe(4);
      });
    });

    it('should spawn exactly one new tile after each move', () => {
      // Set up a grid with many empty cells
      model.setGridStateForTesting([
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      const initialNonEmptyCount = 1;
      const emptyCellValue = model.getEmptyCellValueForTesting();

      model.move(MoveDirection.LEFT);

      const newGrid = model.getGrid();
      let newNonEmptyCount = 0;
      for (const row of newGrid) {
        for (const cell of row) {
          if (cell !== emptyCellValue) {
            newNonEmptyCount++;
          }
        }
      }

      expect(newNonEmptyCount).toBe(initialNonEmptyCount + 1);
    });

    it('should create new tiles with valid 2048 game values after move', () => {
      const validValues = model.getNewCellValuesForTesting();
      const emptyCellValue = model.getEmptyCellValueForTesting();

      // Test multiple times to ensure randomness works properly
      for (let i = 0; i < 10; i++) {
        model.setGridStateForTesting([
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        model.move(MoveDirection.LEFT);
        const grid = model.getGrid();

        // Find the new tile that was added after the move
        let newTileValue: number | null = null;
        let foundTiles = 0;

        for (const row of grid) {
          for (const cell of row) {
            if (cell !== emptyCellValue) {
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
          expect(validValues).toContain(newTileValue);
        }
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
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.LEFT);

      const newGrid = model.getGrid();
      expect(newGrid[0][0]).toBe(4);
      expect(newGrid[0][1]).toBe(8);
      expect(newGrid[0][2]).toBe(0);
      expect(newGrid[0][3]).toBe(0);
    });

    it('should not merge tiles twice in one move', () => {
      // Set up: [4, 2, 2, 0] -> LEFT -> [4, 4, 0, 0] (not [8, 0, 0, 0])
      model.setGridStateForTesting([
        [4, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      model.moveWithoutCreatingNewNonEmptyCellForTesting(MoveDirection.LEFT);

      const newGrid = model.getGrid();
      expect(newGrid[0][0]).toBe(4);
      expect(newGrid[0][1]).toBe(4);
      expect(newGrid[0][2]).toBe(0);
      expect(newGrid[0][3]).toBe(0);
    });

    it('should handle full grid scenarios', () => {
      // Test with a nearly full grid
      model.setGridStateForTesting([
        [2, 4, 8, 16],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 0], // One empty cell
      ]);

      model.move(MoveDirection.LEFT);

      // Verify that the move was processed and exactly one new tile was added
      const emptyCount = model.getEmptyCellCountForTesting();

      expect(emptyCount).toBe(0); // All cells should be filled after the move
    });
  });
});
