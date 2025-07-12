import {describe, expect, it, vi} from 'vitest';

import {getRandomInteger, pickRandomElement} from './random-helpers.js';

describe('getRandomInteger', () => {
  it('should return an integer within the specified range', () => {
    const begin = 1;
    const end = 10;
    const result = getRandomInteger(begin, end);

    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(begin);
    expect(result).toBeLessThan(end);
  });

  it('should return begin when begin equals end - 1', () => {
    const begin = 5;
    const end = 6;
    const result = getRandomInteger(begin, end);

    expect(result).toBe(begin);
  });

  it('should handle negative ranges correctly', () => {
    const begin = -10;
    const end = -5;
    const result = getRandomInteger(begin, end);

    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(begin);
    expect(result).toBeLessThan(end);
  });

  it('should handle ranges crossing zero', () => {
    const begin = -5;
    const end = 5;
    const result = getRandomInteger(begin, end);

    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(begin);
    expect(result).toBeLessThan(end);
  });

  it('should throw an error when begin is not an integer', () => {
    expect(() => getRandomInteger(1.5, 10)).toThrow();
  });

  it('should throw an error when end is not an integer', () => {
    expect(() => getRandomInteger(1, 10.5)).toThrow();
  });

  it('should generate different values over multiple calls', () => {
    const begin = 1;
    const end = 100;
    const results = new Set();

    // Generate 50 random numbers
    for (let i = 0; i < 50; i++) {
      results.add(getRandomInteger(begin, end));
    }

    // We expect at least some variety (not all the same number)
    expect(results.size).toBeGreaterThan(1);
  });

  it('should work with large ranges', () => {
    const begin = 1000000;
    const end = 2000000;
    const result = getRandomInteger(begin, end);

    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(begin);
    expect(result).toBeLessThan(end);
  });

  it('should work with zero as begin', () => {
    const begin = 0;
    const end = 5;
    const result = getRandomInteger(begin, end);

    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(begin);
    expect(result).toBeLessThan(end);
  });
});

describe('pickRandomElement', () => {
  it('should return an element from a single-element array', () => {
    const elements = ['only-element'];
    const result = pickRandomElement(elements);

    expect(result).toBe('only-element');
  });

  it('should return an element that exists in the array', () => {
    const elements = ['a', 'b', 'c', 'd', 'e'];
    const result = pickRandomElement(elements);

    expect(elements).toContain(result);
  });

  it('should work with arrays of different data types', () => {
    const numberArray = [1, 2, 3, 4, 5];
    const numberResult = pickRandomElement(numberArray);
    expect(numberArray).toContain(numberResult);

    const objectArray = [{id: 1}, {id: 2}, {id: 3}];
    const objectResult = pickRandomElement(objectArray);
    expect(objectArray).toContain(objectResult);

    const booleanArray = [true, false];
    const booleanResult = pickRandomElement(booleanArray);
    expect(booleanArray).toContain(booleanResult);
  });

  it('should throw an error when array is empty', () => {
    const elements: string[] = [];

    expect(() => pickRandomElement(elements)).toThrow();
  });

  it('should generate different elements over multiple calls with sufficient variety', () => {
    const elements = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const results = new Set();

    // Pick 30 random elements
    for (let i = 0; i < 30; i++) {
      results.add(pickRandomElement(elements));
    }

    // We expect some variety (not all the same element)
    expect(results.size).toBeGreaterThan(1);
  });

  it('should work with arrays containing undefined or null values', () => {
    const elements = [undefined, null, 'valid'];
    const result = pickRandomElement(elements);

    expect(elements).toContain(result);
  });

  it('should maintain proper typing for generic arrays', () => {
    interface TestInterface {
      value: number;
    }

    const elements: TestInterface[] = [{value: 1}, {value: 2}, {value: 3}];
    const result = pickRandomElement(elements);

    expect(typeof result.value).toBe('number');
    expect(elements).toContain(result);
  });

  it('should work with very large arrays', () => {
    const largeArray = Array.from({length: 10000}, (_, i) => i);
    const result = pickRandomElement(largeArray);

    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(10000);
  });
});

describe('integration tests', () => {
  it('should work together when pickRandomElement uses getRandomInteger internally', () => {
    // Mock Math.random to test deterministic behavior
    const mockRandom = vi.spyOn(Math, 'random');
    mockRandom.mockReturnValue(0.5);

    const elements = ['a', 'b', 'c', 'd'];
    const result = pickRandomElement(elements);

    // With Math.random() = 0.5, we expect the middle elements
    expect(elements).toContain(result);

    mockRandom.mockRestore();
  });
});
