import {describe, expect, test} from 'vitest';

import {PLACEHOLDER_MARK} from '../constants.js';
import {format} from './string-helpers.js';

describe('format', () => {
  test('returns the template when there are no placeholders and no args', () => {
    expect(format('Hello World')).toBe('Hello World');
  });

  test('throws error when args are provided but there are no placeholders', () => {
    expect(() => format('Hello World', 'arg1')).toThrowError();
  });

  test('throws error when placeholders exist but no args are provided', () => {
    expect(() => format(`Hello ${PLACEHOLDER_MARK}`)).toThrowError();
  });

  test('replaces a single placeholder with an argument', () => {
    expect(format(`Hello ${PLACEHOLDER_MARK}`, 'Alice')).toBe('Hello Alice');
  });

  test('replaces multiple placeholders with arguments in order', () => {
    const template = `${PLACEHOLDER_MARK} + ${PLACEHOLDER_MARK} = ${PLACEHOLDER_MARK}`;
    expect(format(template, '1', '2', '3')).toBe('1 + 2 = 3');
  });

  test('throws error when more args are provided than placeholders', () => {
    expect(() =>
      format(`Hello ${PLACEHOLDER_MARK}`, 'Alice', 'Bob'),
    ).toThrowError();
  });

  test('throws error when fewer args are provided than placeholders', () => {
    const template = `Hello ${PLACEHOLDER_MARK} ${PLACEHOLDER_MARK}`;
    expect(() => format(template, 'Alice')).toThrowError();
  });

  test('handles placeholders surrounded by text', () => {
    const template = `Name: ${PLACEHOLDER_MARK}, Age: ${PLACEHOLDER_MARK}`;
    expect(format(template, 'Alice', '30')).toBe('Name: Alice, Age: 30');
  });

  test('replaces placeholders at the start and end of the template', () => {
    const template = `${PLACEHOLDER_MARK}Hello${PLACEHOLDER_MARK}`;
    expect(format(template, 'A', 'B')).toBe('AHelloB');
  });

  test('handles empty string arguments', () => {
    expect(format(`Test ${PLACEHOLDER_MARK}`, '')).toBe('Test ');
  });

  test('returns empty string for empty template', () => {
    expect(format('')).toBe('');
  });

  test('throws error for empty template with arguments', () => {
    expect(() => format('', 'arg')).toThrowError();
  });

  test('replaces placeholders with special characters', () => {
    const template = `${PLACEHOLDER_MARK}: ${PLACEHOLDER_MARK}`;
    expect(format(template, 'Key', 'Value!@#')).toBe('Key: Value!@#');
  });
});
