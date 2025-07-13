import assert from 'node:assert';

/**
 * Generates a random integer in range [begin, end).
 * @param begin - Inclusive lower bound, must be an integer.
 * @param end - Exclusive upper bound, must be an integer.
 * @returns Random integer between begin and end
 */
export function getRandomInteger(begin: number, end: number): number {
  assert(Number.isInteger(begin), 'begin should be an integer.');
  assert(Number.isInteger(end), 'end should be an integer.');

  const diff = end - begin;
  return Math.floor(Math.random() * diff + begin);
}

export function pickRandomElement<T>(elements: readonly T[]): T {
  assert(elements.length > 0, 'elements should not be empty');

  const begin = 0;
  const end = elements.length;
  const randomIndex = getRandomInteger(begin, end);
  return elements[randomIndex];
}
