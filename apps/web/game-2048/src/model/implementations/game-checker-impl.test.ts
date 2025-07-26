import {describe, expect, it} from 'vitest';

import {GameCheckerImpl} from './game-checker-impl.js';
import {GridManagerImpl} from './grid-manager-impl.js';

describe('GameCheckerImpl', () => {
  describe('isGameOver', () => {
    it('should return false when there are empty tiles', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 0], // Empty tile
        [4, 2, 4, 2],
      ]);
      const gameChecker = new GameCheckerImpl(gridManager);

      expect(gameChecker.isGameOver()).toBe(false);
    });

    it('should return false when horizontal merge is possible', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 8, 16],
        [4, 2, 4, 2],
        [8, 16, 2, 4],
        [16, 8, 4, 4], // Adjacent tiles with same value
      ]);
      const gameChecker = new GameCheckerImpl(gridManager);

      expect(gameChecker.isGameOver()).toBe(false);
    });

    it('should return false when vertical merge is possible', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 8, 16],
        [4, 2, 4, 2],
        [8, 2, 2, 4], // Vertical adjacent tiles with same value
        [16, 8, 4, 2],
      ]);
      const gameChecker = new GameCheckerImpl(gridManager);

      expect(gameChecker.isGameOver()).toBe(false);
    });

    it('should return true when game is over (no empty tiles and no merges possible)', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]);
      const gameChecker = new GameCheckerImpl(gridManager);

      expect(gameChecker.isGameOver()).toBe(true);
    });

    it('should return false when merge is possible at top-left corner', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 2, 4, 8], // Horizontal merge at start
        [4, 8, 2, 4],
        [2, 4, 8, 2],
        [8, 2, 4, 16],
      ]);
      const gameChecker = new GameCheckerImpl(gridManager);

      expect(gameChecker.isGameOver()).toBe(false);
    });

    it('should return false when merge is possible at bottom-right area', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 8, 16],
        [4, 8, 2, 4],
        [8, 2, 4, 2],
        [16, 4, 2, 2], // Horizontal merge at end
      ]);
      const gameChecker = new GameCheckerImpl(gridManager);

      expect(gameChecker.isGameOver()).toBe(false);
    });

    it('should return false when merge is possible with vertical adjacency', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 8, 16],
        [2, 8, 2, 4], // Vertical merge possible
        [4, 2, 4, 8],
        [8, 16, 8, 2],
      ]);
      const gameChecker = new GameCheckerImpl(gridManager);

      expect(gameChecker.isGameOver()).toBe(false);
    });

    it('should handle edge case with alternating pattern', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 8, 16],
        [16, 8, 4, 2],
        [2, 4, 8, 16],
        [16, 8, 4, 2],
      ]);
      const gameChecker = new GameCheckerImpl(gridManager);

      expect(gameChecker.isGameOver()).toBe(true);
    });
  });
});
