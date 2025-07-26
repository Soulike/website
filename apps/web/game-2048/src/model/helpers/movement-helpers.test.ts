import {describe, expect, it} from 'vitest';

import type {
  CompactMovement,
  MergeMovement,
  OperationMovements,
} from '../types.js';
import {MovementType} from '../types.js';
import {combineMovements} from './movement-helpers.js';

describe('movement-helpers', () => {
  describe('combineMovements', () => {
    it('should return empty movements when input is empty', () => {
      const operationMovements: OperationMovements = {
        mergeMovements: [],
        compactMovements: [],
      };

      const result = combineMovements(operationMovements);

      expect(result.mergeMovements).toHaveLength(0);
      expect(result.compactMovements).toHaveLength(0);
    });

    it('should keep merge movements unchanged when no matching compact movements', () => {
      const mergeMovements: MergeMovement[] = [
        {
          from: {row: 0, col: 0},
          to: {row: 0, col: 1},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
      ];

      const operationMovements: OperationMovements = {
        mergeMovements,
        compactMovements: [],
      };

      const result = combineMovements(operationMovements);

      expect(result.mergeMovements).toEqual(mergeMovements);
      expect(result.compactMovements).toHaveLength(0);
    });

    it('should keep compact movements unchanged when no matching merge movements', () => {
      const compactMovements: CompactMovement[] = [
        {
          from: {row: 0, col: 0},
          to: {row: 0, col: 1},
          type: MovementType.COMPACT,
        },
      ];

      const operationMovements: OperationMovements = {
        mergeMovements: [],
        compactMovements,
      };

      const result = combineMovements(operationMovements);

      expect(result.mergeMovements).toHaveLength(0);
      expect(result.compactMovements).toEqual(compactMovements);
    });

    it('should combine merge and compact movements when merge.to equals compact.from', () => {
      const mergeMovements: MergeMovement[] = [
        {
          from: {row: 0, col: 0},
          to: {row: 0, col: 1},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
      ];

      const compactMovements: CompactMovement[] = [
        {
          from: {row: 0, col: 1},
          to: {row: 0, col: 2},
          type: MovementType.COMPACT,
        },
      ];

      const operationMovements: OperationMovements = {
        mergeMovements,
        compactMovements,
      };

      const result = combineMovements(operationMovements);

      expect(result.mergeMovements).toHaveLength(1);
      expect(result.mergeMovements[0]).toEqual({
        from: {row: 0, col: 0},
        to: {row: 0, col: 2},
        type: MovementType.MERGE,
        scoreChange: 4,
      });
      expect(result.compactMovements).toStrictEqual(compactMovements);
    });

    it('should handle multiple merge movements with some combinable', () => {
      const mergeMovements: MergeMovement[] = [
        {
          from: {row: 0, col: 0},
          to: {row: 0, col: 1},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
        {
          from: {row: 1, col: 0},
          to: {row: 1, col: 1},
          type: MovementType.MERGE,
          scoreChange: 8,
        },
      ];

      const compactMovements: CompactMovement[] = [
        {
          from: {row: 0, col: 1},
          to: {row: 0, col: 2},
          type: MovementType.COMPACT,
        },
      ];

      const operationMovements: OperationMovements = {
        mergeMovements,
        compactMovements,
      };

      const result = combineMovements(operationMovements);

      expect(result.mergeMovements).toHaveLength(2);
      expect(result.mergeMovements).toContainEqual({
        from: {row: 0, col: 0},
        to: {row: 0, col: 2},
        type: MovementType.MERGE,
        scoreChange: 4,
      });
      expect(result.mergeMovements).toContainEqual({
        from: {row: 1, col: 0},
        to: {row: 1, col: 1},
        type: MovementType.MERGE,
        scoreChange: 8,
      });
      expect(result.compactMovements).toStrictEqual(compactMovements);
    });

    it('should keep unused compact movements', () => {
      const mergeMovements: MergeMovement[] = [
        {
          from: {row: 0, col: 0},
          to: {row: 0, col: 1},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
      ];

      const compactMovements: CompactMovement[] = [
        {
          from: {row: 0, col: 1},
          to: {row: 0, col: 2},
          type: MovementType.COMPACT,
        },
        {
          from: {row: 1, col: 0},
          to: {row: 1, col: 1},
          type: MovementType.COMPACT,
        },
      ];

      const operationMovements: OperationMovements = {
        mergeMovements,
        compactMovements,
      };

      const result = combineMovements(operationMovements);

      expect(result.mergeMovements).toHaveLength(1);
      expect(result.mergeMovements[0]).toEqual({
        from: {row: 0, col: 0},
        to: {row: 0, col: 2},
        type: MovementType.MERGE,
        scoreChange: 4,
      });
      expect(result.compactMovements).toStrictEqual(compactMovements);
    });

    it('should handle complex scenario with multiple movements', () => {
      const mergeMovements: MergeMovement[] = [
        {
          from: {row: 0, col: 0},
          to: {row: 0, col: 1},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
        {
          from: {row: 1, col: 0},
          to: {row: 1, col: 1},
          type: MovementType.MERGE,
          scoreChange: 8,
        },
        {
          from: {row: 2, col: 0},
          to: {row: 2, col: 1},
          type: MovementType.MERGE,
          scoreChange: 16,
        },
      ];

      const compactMovements: CompactMovement[] = [
        {
          from: {row: 0, col: 1},
          to: {row: 0, col: 2},
          type: MovementType.COMPACT,
        },
        {
          from: {row: 1, col: 1},
          to: {row: 1, col: 3},
          type: MovementType.COMPACT,
        },
        {
          from: {row: 3, col: 0},
          to: {row: 3, col: 1},
          type: MovementType.COMPACT,
        },
      ];

      const operationMovements: OperationMovements = {
        mergeMovements,
        compactMovements,
      };

      const result = combineMovements(operationMovements);

      expect(result.mergeMovements).toHaveLength(3);
      expect(result.mergeMovements).toContainEqual({
        from: {row: 0, col: 0},
        to: {row: 0, col: 2},
        type: MovementType.MERGE,
        scoreChange: 4,
      });
      expect(result.mergeMovements).toContainEqual({
        from: {row: 1, col: 0},
        to: {row: 1, col: 3},
        type: MovementType.MERGE,
        scoreChange: 8,
      });
      expect(result.mergeMovements).toContainEqual({
        from: {row: 2, col: 0},
        to: {row: 2, col: 1},
        type: MovementType.MERGE,
        scoreChange: 16,
      });
      expect(result.compactMovements).toStrictEqual(compactMovements);
    });

    it('should allow each compact movement to be used multiple times', () => {
      const mergeMovements: MergeMovement[] = [
        {
          from: {row: 0, col: 0},
          to: {row: 0, col: 1},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
        {
          from: {row: 1, col: 0},
          to: {row: 0, col: 1},
          type: MovementType.MERGE,
          scoreChange: 4,
        },
      ];

      const compactMovements: CompactMovement[] = [
        {
          from: {row: 0, col: 1},
          to: {row: 0, col: 2},
          type: MovementType.COMPACT,
        },
      ];

      const operationMovements: OperationMovements = {
        mergeMovements,
        compactMovements,
      };

      const result = combineMovements(operationMovements);

      expect(result.mergeMovements).toHaveLength(2);
      // Both merge movements should be combined with the same compact movement
      expect(result.mergeMovements).toContainEqual({
        from: {row: 0, col: 0},
        to: {row: 0, col: 2},
        type: MovementType.MERGE,
        scoreChange: 4,
      });
      expect(result.mergeMovements).toContainEqual({
        from: {row: 1, col: 0},
        to: {row: 0, col: 2},
        type: MovementType.MERGE,
        scoreChange: 4,
      });
      expect(result.compactMovements).toStrictEqual(compactMovements);
    });
  });
});
