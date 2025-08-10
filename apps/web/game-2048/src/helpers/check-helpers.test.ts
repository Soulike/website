import {describe, expect, it} from 'vitest';

import {isPowerOfTwo, isValid2048Value} from './check-helpers.js';

describe('isPowerOfTwo', () => {
  it('should return true for 0', () => {
    expect(isPowerOfTwo(0)).toBe(true);
  });

  it('should return true for powers of 2', () => {
    const powersOfTwo = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

    for (const power of powersOfTwo) {
      expect(isPowerOfTwo(power)).toBe(true);
    }
  });

  it('should return false for non-powers of 2', () => {
    const nonPowersOfTwo = [
      3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 100, 1000,
    ];

    for (const value of nonPowersOfTwo) {
      expect(isPowerOfTwo(value)).toBe(false);
    }
  });

  it('should return false for negative numbers', () => {
    expect(isPowerOfTwo(-1)).toBe(false);
    expect(isPowerOfTwo(-2)).toBe(false);
    expect(isPowerOfTwo(-4)).toBe(false);
    expect(isPowerOfTwo(-8)).toBe(false);
  });

  it('should return false for non-integer numbers', () => {
    expect(isPowerOfTwo(1.5)).toBe(false);
    expect(isPowerOfTwo(2.5)).toBe(false);
    expect(isPowerOfTwo(3.14)).toBe(false);
    expect(isPowerOfTwo(0.5)).toBe(false);
  });

  it('should return false for special float values', () => {
    expect(isPowerOfTwo(Infinity)).toBe(false);
    expect(isPowerOfTwo(-Infinity)).toBe(false);
    expect(isPowerOfTwo(NaN)).toBe(false);
  });
});

describe('isValid2048Value', () => {
  it('should return false for 1', () => {
    expect(isValid2048Value(1)).toBe(false);
  });

  it('should return true for 0', () => {
    expect(isValid2048Value(0)).toBe(true);
  });

  it('should return true for valid 2048 values (powers of 2 except 1)', () => {
    const valid2048Values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

    for (const value of valid2048Values) {
      expect(isValid2048Value(value)).toBe(true);
    }
  });

  it('should return false for non-powers of 2', () => {
    const nonPowersOfTwo = [
      3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 100, 1000,
    ];

    for (const value of nonPowersOfTwo) {
      expect(isValid2048Value(value)).toBe(false);
    }
  });

  it('should return false for negative numbers', () => {
    expect(isValid2048Value(-1)).toBe(false);
    expect(isValid2048Value(-2)).toBe(false);
    expect(isValid2048Value(-4)).toBe(false);
  });

  it('should return false for non-integer numbers', () => {
    expect(isValid2048Value(1.5)).toBe(false);
    expect(isValid2048Value(2.5)).toBe(false);
    expect(isValid2048Value(3.14)).toBe(false);
  });
});
