import {act, renderHook, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import {usePromise} from './usePromise.js';

describe('usePromise', () => {
  it('returns initial pending state', () => {
    const promise = new Promise<string>(() => {
      // Never resolves - used to test initial pending state
    });
    const {result} = renderHook(() => usePromise(promise));

    expect(result.current.pending).toBe(true);
    expect(result.current.resolvedValue).toBeNull();
    expect(result.current.rejectedError).toBeNull();
  });

  it('resolves promise and updates state', async () => {
    const promise = Promise.resolve('result');
    const {result} = renderHook(() => usePromise(promise));

    await waitFor(() => {
      expect(result.current.pending).toBe(false);
    });

    expect(result.current.resolvedValue).toBe('result');
    expect(result.current.rejectedError).toBeNull();
  });

  it('handles rejection and updates state', async () => {
    const error = new Error('test error');
    const promise = Promise.reject(error);
    const {result} = renderHook(() => usePromise(promise));

    await waitFor(() => {
      expect(result.current.pending).toBe(false);
    });

    expect(result.current.resolvedValue).toBeNull();
    expect(result.current.rejectedError).toBe(error);
  });

  it('calls onResolve callback when promise resolves', async () => {
    const onResolve = vi.fn();
    const promise = Promise.resolve('result');
    renderHook(() => usePromise(promise, onResolve));

    await waitFor(() => {
      expect(onResolve).toHaveBeenCalledWith('result');
    });
  });

  it('calls onReject callback when promise rejects', async () => {
    const onReject = vi.fn();
    const error = new Error('test error');
    const promise = Promise.reject(error);
    renderHook(() => usePromise(promise, undefined, onReject));

    await waitFor(() => {
      expect(onReject).toHaveBeenCalledWith(error);
    });
  });

  describe('race condition handling', () => {
    it('uses only the latest promise result when promise prop changes', async () => {
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

      const {result, rerender} = renderHook(
        ({promise}) => usePromise(promise),
        {initialProps: {promise: firstPromise}},
      );

      // Change to second promise
      rerender({promise: secondPromise});

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

      // Result should still be from second promise
      expect(result.current.resolvedValue).toBe('second result');
      expect(result.current.pending).toBe(false);
    });

    it('ignores stale rejection when newer promise succeeds', async () => {
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

      const {result, rerender} = renderHook(
        ({promise}) => usePromise(promise),
        {initialProps: {promise: firstPromise}},
      );

      // Change to second promise
      rerender({promise: secondPromise});

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

    it('does not call stale onResolve callback', async () => {
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

      const onResolveFirst = vi.fn();
      const onResolveSecond = vi.fn();

      const {rerender} = renderHook(
        ({promise, onResolve}) => usePromise(promise, onResolve),
        {initialProps: {promise: firstPromise, onResolve: onResolveFirst}},
      );

      // Change to second promise with new callback
      rerender({promise: secondPromise, onResolve: onResolveSecond});

      // Resolve second first
      act(() => {
        resolveSecond('second result');
      });

      await waitFor(() => {
        expect(onResolveSecond).toHaveBeenCalledWith('second result');
      });

      // Now resolve first (callback should not be called)
      act(() => {
        resolveFirst('first result');
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // First callback should never have been called
      expect(onResolveFirst).not.toHaveBeenCalled();
    });
  });
});
