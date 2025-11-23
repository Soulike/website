import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {throttle} from './throttle.js';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call the function immediately on first invocation', () => {
    const fn = vi.fn();
    const throttled = throttle(100, fn, []);

    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should not call the function again before the delay has passed', () => {
    const fn = vi.fn();
    const throttled = throttle(100, fn, []);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should call the function again after the delay has passed', () => {
    const fn = vi.fn();
    const throttled = throttle(100, fn, []);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should call the original function with provided parameters', () => {
    const fn = vi.fn();
    const throttled = throttle(100, fn, ['arg1', 'arg2']);

    throttled();

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should preserve the return value of the original function', () => {
    const fn = vi.fn<() => string>().mockReturnValue('result');
    const throttled = throttle(100, fn, []);

    const result = throttled();

    expect(result).toBe('result');
  });

  it('should handle functions with different parameter types', () => {
    const fn = vi.fn();
    const throttled = throttle(100, fn, [42, 'test', true]);

    throttled();

    expect(fn).toHaveBeenCalledWith(42, 'test', true);
  });

  it('should work with different delay values', () => {
    const fn = vi.fn();
    const throttled = throttle(200, fn, []);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1); // Still throttled

    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2); // Now can be called again
  });

  it('should handle zero delay', () => {
    const fn = vi.fn();
    const throttled = throttle(0, fn, []);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should maintain independent throttling for different instances', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const throttled1 = throttle(100, fn1, ['param1']);
    const throttled2 = throttle(100, fn2, ['param2']);

    throttled1();
    throttled2();

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledWith('param1');
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledWith('param2');

    throttled1();
    throttled2();

    expect(fn1).toHaveBeenCalledTimes(1); // Still throttled
    expect(fn2).toHaveBeenCalledTimes(1); // Still throttled
  });

  it('should work with functions that return different types', () => {
    const stringFn = vi.fn().mockReturnValue('string result');
    const numberFn = vi.fn().mockReturnValue(42);
    const booleanFn = vi.fn().mockReturnValue(true);

    const throttledString = throttle(100, stringFn, []);
    const throttledNumber = throttle(100, numberFn, []);
    const throttledBoolean = throttle(100, booleanFn, []);

    expect(throttledString()).toBe('string result');
    expect(throttledNumber()).toBe(42);
    expect(throttledBoolean()).toBe(true);
  });

  it('should handle negative delay values', () => {
    const fn = vi.fn();
    const throttled = throttle(-100, fn, []);

    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should work with async functions', async () => {
    const fn = vi
      .fn<(string: string) => Promise<string>>()
      .mockResolvedValue('async result');
    const throttled = throttle(100, fn, ['async param']);

    const result = await throttled();

    expect(result).toBe('async result');
    expect(fn).toHaveBeenCalledWith('async param');
  });

  it('should work with functions that have side effects', () => {
    let counter = 0;
    const fn = (increment: number) => {
      counter += increment;
      return counter;
    };
    const throttled = throttle(100, fn, [5]);

    const result1 = throttled();
    expect(result1).toBe(5);
    expect(counter).toBe(5);

    throttled(); // Should be throttled
    expect(counter).toBe(5); // No change

    vi.advanceTimersByTime(100);
    const result2 = throttled();
    expect(result2).toBe(10);
    expect(counter).toBe(10);
  });

  it('should handle empty parameter arrays', () => {
    const fn = vi.fn<() => string>().mockReturnValue('no params');
    const throttled = throttle(100, fn, []);

    const result = throttled();

    expect(result).toBe('no params');
    expect(fn).toHaveBeenCalledWith();
  });

  it('should handle single parameter', () => {
    const fn = vi.fn((x: number) => x * 2);
    const throttled = throttle(100, fn, [21]);

    const result = throttled();

    expect(result).toBe(42);
    expect(fn).toHaveBeenCalledWith(21);
  });

  it('should handle multiple parameters', () => {
    const fn = vi.fn((a: number, b: string, c: boolean) => `${a}-${b}-${c}`);
    const throttled = throttle(100, fn, [123, 'test', true]);

    const result = throttled();

    expect(result).toBe('123-test-true');
    expect(fn).toHaveBeenCalledWith(123, 'test', true);
  });
});
