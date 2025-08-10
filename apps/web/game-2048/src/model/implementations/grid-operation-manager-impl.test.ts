import {describe, expect, it, vi} from 'vitest';

import {GRID_SIDE_LENGTH} from '@/constants/configs.js';

import {MovementType} from '../types.js';
import {GridManagerImpl} from './grid-manager-impl.js';
import {GridOperationManagerImpl} from './grid-operation-manager-impl.js';

describe('GridOperationManagerImpl', () => {
  describe('compactRow', () => {
    it('should compact row to left correctly', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 0, 4, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.compactRow(0, true);

      expect(movements).toEqual([
        {
          from: {row: 0, col: 2},
          to: {row: 0, col: 1},
          type: MovementType.COMPACT,
        },
      ]);
      expect(gridManager.getGrid()[0]).toEqual([2, 4, 0, 0]);
    });

    it('should compact row to right correctly', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 0, 4, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.compactRow(0, false);

      expect(movements).toEqual([
        {
          from: {row: 0, col: 2},
          to: {row: 0, col: 3},
          type: MovementType.COMPACT,
        },
        {
          from: {row: 0, col: 0},
          to: {row: 0, col: 2},
          type: MovementType.COMPACT,
        },
      ]);
      expect(gridManager.getGrid()[0]).toEqual([0, 0, 2, 4]);
    });

    it('should handle already compacted row', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.compactRow(0, true);

      expect(movements).toEqual([]);
      expect(gridManager.getGrid()[0]).toEqual([2, 4, 8, 16]);
    });
  });

  describe('compactCol', () => {
    it('should compact column up correctly', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [4, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.compactCol(0, true);

      expect(movements).toEqual([
        {
          from: {row: 2, col: 0},
          to: {row: 1, col: 0},
          type: MovementType.COMPACT,
        },
      ]);
      expect(gridManager.getGrid().map((row) => row[0])).toEqual([2, 4, 0, 0]);
    });

    it('should compact column down correctly', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [4, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.compactCol(0, false);

      expect(movements).toEqual([
        {
          from: {row: 2, col: 0},
          to: {row: 3, col: 0},
          type: MovementType.COMPACT,
        },
        {
          from: {row: 0, col: 0},
          to: {row: 2, col: 0},
          type: MovementType.COMPACT,
        },
      ]);
      expect(gridManager.getGrid().map((row) => row[0])).toEqual([0, 0, 2, 4]);
    });
  });

  describe('mergeRow', () => {
    it('should merge row to left correctly', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 2, 4, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.mergeRow(0, true);

      expect(movements).toEqual([
        {
          from: {row: 0, col: 1},
          to: {row: 0, col: 0},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
        {
          from: {row: 0, col: 3},
          to: {row: 0, col: 2},
          type: MovementType.MERGE,
          scoreChange: 8,
        },
      ]);
      expect(gridManager.getGrid()[0]).toEqual([4, 0, 8, 0]);
    });

    it('should merge row to right correctly', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 2, 4, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.mergeRow(0, false);

      expect(movements).toEqual([
        {
          from: {row: 0, col: 2},
          to: {row: 0, col: 3},
          type: MovementType.MERGE,
          scoreChange: 8,
        },
        {
          from: {row: 0, col: 0},
          to: {row: 0, col: 1},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
      ]);
      expect(gridManager.getGrid()[0]).toEqual([0, 4, 0, 8]);
    });

    it('should handle non-adjacent merges', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 0, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.mergeRow(0, true);

      expect(movements).toEqual([
        {
          from: {row: 0, col: 2},
          to: {row: 0, col: 0},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
      ]);
      expect(gridManager.getGrid()[0]).toEqual([4, 0, 0, 0]);
    });

    it('should not merge different values', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.mergeRow(0, true);

      expect(movements).toEqual([]);
      expect(gridManager.getGrid()[0]).toEqual([2, 4, 8, 16]);
    });
  });

  describe('mergeCol', () => {
    it('should merge column up correctly', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [4, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.mergeCol(0, true);

      expect(movements).toEqual([
        {
          from: {row: 1, col: 0},
          to: {row: 0, col: 0},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
        {
          from: {row: 3, col: 0},
          to: {row: 2, col: 0},
          type: MovementType.MERGE,
          scoreChange: 8,
        },
      ]);
      expect(gridManager.getGrid().map((row) => row[0])).toEqual([4, 0, 8, 0]);
    });

    it('should merge column down correctly', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [4, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      const movements = operationManager.mergeCol(0, false);

      expect(movements).toEqual([
        {
          from: {row: 2, col: 0},
          to: {row: 3, col: 0},
          type: MovementType.MERGE,
          scoreChange: 8,
        },
        {
          from: {row: 0, col: 0},
          to: {row: 1, col: 0},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
      ]);
      expect(gridManager.getGrid().map((row) => row[0])).toEqual([0, 4, 0, 8]);
    });
  });

  describe('createNewTile', () => {
    it('should create single new tile', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      // Mock Math.random to control tile placement and value
      const originalRandom = Math.random;
      Math.random = vi.fn().mockReturnValue(0);

      const creations = operationManager.createNewTile(1);

      expect(creations).toHaveLength(1);
      expect(creations[0].coordinate).toEqual({
        row: GRID_SIDE_LENGTH - 1,
        col: GRID_SIDE_LENGTH - 1,
      });
      expect([2, 4]).toContain(creations[0].value);

      Math.random = originalRandom;
    });

    it('should create multiple new tiles', () => {
      const gridManager = new GridManagerImpl();
      gridManager.clearGridForTesting(); // All empty
      const operationManager = new GridOperationManagerImpl(gridManager);

      const creations = operationManager.createNewTile(2);

      expect(creations).toHaveLength(2);
      expect(creations[0].coordinate).not.toEqual(creations[1].coordinate);
      creations.forEach((creation) => {
        expect([2, 4]).toContain(creation.value);
      });
    });

    it('should throw when not enough empty tiles', () => {
      const gridManager = new GridManagerImpl();
      gridManager.setGridStateForTesting([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 0], // Only one empty tile
      ]);
      const operationManager = new GridOperationManagerImpl(gridManager);

      expect(() => operationManager.createNewTile(2)).toThrow();
    });
  });
});
