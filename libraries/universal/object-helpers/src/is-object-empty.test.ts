import assert from 'node:assert';

import {expect, test} from 'vitest';

import {isObjectEmpty} from './is-object-empty.js';

test('returns true for empty object {}', () => {
  expect(isObjectEmpty({})).toBe(true);
});

test('returns false for object with properties', () => {
  expect(isObjectEmpty({a: 1})).toBe(false);
  expect(isObjectEmpty({key: null})).toBe(false);
  expect(isObjectEmpty({nested: {obj: true}})).toBe(false);
});

test('returns false for objects with non-enumerable properties', () => {
  const obj = {};
  Object.defineProperty(obj, 'hidden', {
    value: 'secret',
    enumerable: false,
  });
  expect(isObjectEmpty(obj)).toBe(false);
});

test('returns true for empty object created with Object.create(null)', () => {
  const emptyObj: unknown = Object.create(null);
  assert(typeof emptyObj === 'object' && emptyObj !== null);
  expect(isObjectEmpty(emptyObj)).toBe(true);
});

test('returns false for objects with symbol keys', () => {
  const symbolKey = Symbol('unique');
  expect(isObjectEmpty({[symbolKey]: 'value'})).toBe(false);
});

test('returns true for objects with only inherited properties', () => {
  const parent = {inherited: true};
  const child: unknown = Object.create(parent);
  assert(typeof child === 'object' && child !== null);
  expect(isObjectEmpty(child)).toBe(true);
});

test('returns false for empty array (consider as non-empty object)', () => {
  expect(isObjectEmpty([])).toBe(false);
});

test('returns false for objects with function properties', () => {
  expect(
    isObjectEmpty({
      fn: () => {
        return 0;
      },
    }),
  ).toBe(false);
});

test('returns false for objects with falsy values', () => {
  expect(isObjectEmpty({a: false})).toBe(false);
  expect(isObjectEmpty({b: 0})).toBe(false);
  expect(isObjectEmpty({c: ''})).toBe(false);
});
