import {describe, expect, it} from 'vitest';

import type {Coordinate} from '../types.js';
import {isCoordinatesEqual} from './coordinate-helpers.js';

describe('coordinate-helpers', () => {
  describe('isCoordinatesEqual', () => {
    it('should return true for identical coordinates', () => {
      const coord1: Coordinate = {row: 0, col: 0};
      const coord2: Coordinate = {row: 0, col: 0};

      expect(isCoordinatesEqual(coord1, coord2)).toBe(true);
    });

    it('should return true for coordinates with same values but different objects', () => {
      const coord1: Coordinate = {row: 2, col: 3};
      const coord2: Coordinate = {row: 2, col: 3};

      expect(isCoordinatesEqual(coord1, coord2)).toBe(true);
    });

    it('should return false for coordinates with different rows', () => {
      const coord1: Coordinate = {row: 1, col: 2};
      const coord2: Coordinate = {row: 2, col: 2};

      expect(isCoordinatesEqual(coord1, coord2)).toBe(false);
    });

    it('should return false for coordinates with different columns', () => {
      const coord1: Coordinate = {row: 1, col: 2};
      const coord2: Coordinate = {row: 1, col: 3};

      expect(isCoordinatesEqual(coord1, coord2)).toBe(false);
    });

    it('should return false for coordinates with both different rows and columns', () => {
      const coord1: Coordinate = {row: 0, col: 0};
      const coord2: Coordinate = {row: 3, col: 3};

      expect(isCoordinatesEqual(coord1, coord2)).toBe(false);
    });

    it('should handle negative coordinates', () => {
      const coord1: Coordinate = {row: -1, col: -2};
      const coord2: Coordinate = {row: -1, col: -2};

      expect(isCoordinatesEqual(coord1, coord2)).toBe(true);
    });

    it('should handle large coordinates', () => {
      const coord1: Coordinate = {row: 1000, col: 2000};
      const coord2: Coordinate = {row: 1000, col: 2000};

      expect(isCoordinatesEqual(coord1, coord2)).toBe(true);
    });
  });
});
