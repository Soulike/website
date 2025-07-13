import {describe, expect, it} from 'vitest';

import {isValid2048Value} from '@/helpers/check-helpers.js';

import {NEW_TILE_VALUES} from './configs.js';

describe('configs', () => {
  describe('NEW_TILE_VALUES', () => {
    it('should contain only valid 2048 numbers', () => {
      for (const value of NEW_TILE_VALUES) {
        expect(isValid2048Value(value)).toBe(true);
      }
    });

    it('should not be empty', () => {
      expect(NEW_TILE_VALUES.length).toBeGreaterThan(0);
    });

    it('should be readonly', () => {
      expect(Object.isFrozen(NEW_TILE_VALUES)).toBe(true);
    });
  });
});
