import {act, renderHook, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import {useLazyPromise} from './useLazyPromise.js';

describe('useLazyPromise', () => {
  it('returns initial state', () => {
    const promiseFactory = vi.fn(() => Promise.resolve('result'));
    const {result} = renderHook(() => useLazyPromise(promiseFactory));

    expect(result.current.pending).toBe(true);
    expect(result.current.resolvedValue).toBeNull();
    expect(result.current.rejectedError).toBeNull();
  });

  it('resolves promise and updates state', async () => {
    const promiseFactory = vi.fn(() => Promise.resolve('result'));
    const {result} = renderHook(() => useLazyPromise(promiseFactory));

    act(() => {
      result.current.run();
    });

    await waitFor(() => {
      expect(result.current.pending).toBe(false);
    });

    expect(result.current.resolvedValue).toBe('result');
    expect(result.current.rejectedError).toBeNull();
  });

  it('handles rejection and updates state', async () => {
    const error = new Error('test error');
    const promiseFactory = vi.fn(() => Promise.reject(error));
    const {result} = renderHook(() => useLazyPromise(promiseFactory));

    act(() => {
      result.current.run();
    });

    await waitFor(() => {
      expect(result.current.pending).toBe(false);
    });

    expect(result.current.resolvedValue).toBeNull();
    expect(result.current.rejectedError).toBe(error);
  });

  it('passes arguments to promiseFactory', async () => {
    const promiseFactory = vi.fn((a: number, b: string) =>
      Promise.resolve(`${a}-${b}`),
    );
    const {result} = renderHook(() => useLazyPromise(promiseFactory));

    act(() => {
      result.current.run(42, 'test');
    });

    await waitFor(() => {
      expect(result.current.pending).toBe(false);
    });

    expect(promiseFactory).toHaveBeenCalledWith(42, 'test');
    expect(result.current.resolvedValue).toBe('42-test');
  });

  it('run function has stable identity', () => {
    const promiseFactory = vi.fn(() => Promise.resolve('result'));
    const {result, rerender} = renderHook(() => useLazyPromise(promiseFactory));

    const runRef = result.current.run;
    rerender();

    expect(result.current.run).toBe(runRef);
  });

  describe('race condition handling', () => {
    it('uses only the latest promise result when multiple calls are made', async () => {
      let resolveFirst: (value: string) => void = () => {
        /* empty */
      };
      let resolveSecond: (value: string) => void = () => {
        /* empty */
      };

      const firstPromise = new Promise<string>((resolve) => {
        resolveFirst = resolve;
      });
      const secondPromise = new Promise<string>((resolve) => {
        resolveSecond = resolve;
      });

      let callCount = 0;
      const promiseFactory = vi.fn(() => {
        callCount++;
        return callCount === 1 ? firstPromise : secondPromise;
      });

      const {result} = renderHook(() => useLazyPromise(promiseFactory));

      // Start first call
      act(() => {
        result.current.run();
      });

      // Start second call (while first is still pending)
      act(() => {
        result.current.run();
      });

      expect(promiseFactory).toHaveBeenCalledTimes(2);

      // Resolve second first
      act(() => {
        resolveSecond('second result');
      });

      await waitFor(() => {
        expect(result.current.pending).toBe(false);
      });

      expect(result.current.resolvedValue).toBe('second result');

      // Now resolve first (should be ignored)
      act(() => {
        resolveFirst('first result');
      });

      // Wait a tick to ensure any state updates would have happened
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Result should still be from second call
      expect(result.current.resolvedValue).toBe('second result');
      expect(result.current.pending).toBe(false);
    });

    it('ignores stale rejection when newer call succeeds', async () => {
      let rejectFirst: (error: Error) => void = () => {
        /* empty */
      };
      let resolveSecond: (value: string) => void = () => {
        /* empty */
      };

      const firstPromise = new Promise<string>((_, reject) => {
        rejectFirst = reject;
      });
      const secondPromise = new Promise<string>((resolve) => {
        resolveSecond = resolve;
      });

      let callCount = 0;
      const promiseFactory = vi.fn(() => {
        callCount++;
        return callCount === 1 ? firstPromise : secondPromise;
      });

      const {result} = renderHook(() => useLazyPromise(promiseFactory));

      // Start first call
      act(() => {
        result.current.run();
      });

      // Start second call
      act(() => {
        result.current.run();
      });

      // Resolve second first
      act(() => {
        resolveSecond('success');
      });

      await waitFor(() => {
        expect(result.current.pending).toBe(false);
      });

      // Reject first (should be ignored)
      act(() => {
        rejectFirst(new Error('stale error'));
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Should show success, not error
      expect(result.current.resolvedValue).toBe('success');
      expect(result.current.rejectedError).toBeNull();
    });

    it('ignores stale success when newer call fails', async () => {
      let resolveFirst: (value: string) => void = () => {
        /* empty */
      };
      let rejectSecond: (error: Error) => void = () => {
        /* empty */
      };

      const firstPromise = new Promise<string>((resolve) => {
        resolveFirst = resolve;
      });
      const secondPromise = new Promise<string>((_, reject) => {
        rejectSecond = reject;
      });

      let callCount = 0;
      const promiseFactory = vi.fn(() => {
        callCount++;
        return callCount === 1 ? firstPromise : secondPromise;
      });

      const {result} = renderHook(() => useLazyPromise(promiseFactory));

      // Start first call
      act(() => {
        result.current.run();
      });

      // Start second call
      act(() => {
        result.current.run();
      });

      const secondError = new Error('second error');

      // Reject second first
      act(() => {
        rejectSecond(secondError);
      });

      await waitFor(() => {
        expect(result.current.pending).toBe(false);
      });

      // Resolve first (should be ignored)
      act(() => {
        resolveFirst('stale success');
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Should show error, not success
      expect(result.current.resolvedValue).toBeNull();
      expect(result.current.rejectedError).toBe(secondError);
    });
  });
});
