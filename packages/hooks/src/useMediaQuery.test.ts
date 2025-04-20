import {act, renderHook} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {useMediaQuery} from './useMediaQuery';

describe('useMediaQuery', () => {
  // Setup mocks
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();

  beforeEach(() => {
    // Create a mock MediaQueryList
    const mediaQueryList = {
      matches: false,
      addEventListener,
      removeEventListener,
    };

    window.matchMedia = vi.fn().mockReturnValue(mediaQueryList);

    // Reset mocks between tests
    vi.clearAllMocks();
  });

  it('returns correct match state', () => {
    // Test initial state (not matching)
    const {result: resultNotMatching} = renderHook(() =>
      useMediaQuery('(min-width: 768px)'),
    );
    expect(resultNotMatching.current).toBe(false);

    // Change match state to true
    const matchingMediaQueryList = {
      matches: true,
      addEventListener,
      removeEventListener,
    };
    (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue(
      matchingMediaQueryList,
    );

    // Test with matching state
    const {result: resultMatching} = renderHook(() =>
      useMediaQuery('(prefers-color-scheme: dark)'),
    );
    expect(resultMatching.current).toBe(true);
  });

  it('updates when media query state changes', () => {
    // Setup
    const {result} = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    // Get the registered event handler
    const handler = addEventListener.mock.calls[0][1] as EventListener;

    // Simulate media query change
    act(() => {
      handler({matches: true} as MediaQueryListEvent);
    });

    // Verify state updated
    expect(result.current).toBe(true);
  });

  it('cleans up event listener on unmount', () => {
    // Setup
    const {unmount} = renderHook(() => useMediaQuery('(min-width: 768px)'));

    // Verify listener was added
    expect(addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );

    // Unmount
    unmount();

    // Verify cleanup
    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });
});
