import {act, renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {useMediaQuery} from './useMediaQuery.js';

type MinimalMediaQueryList = Pick<
  MediaQueryList,
  'matches' | 'addEventListener' | 'removeEventListener'
>;

describe('useMediaQuery', () => {
  // Setup mocks
  const addEventListener = vi.fn<MediaQueryList['addEventListener']>();
  const removeEventListener = vi.fn<MediaQueryList['removeEventListener']>();
  let originalMatchMediaDescriptor: PropertyDescriptor | undefined;
  let matchMediaMock: ReturnType<
    typeof vi.fn<(query: string) => MinimalMediaQueryList>
  >;

  const createMediaQueryList = (matches: boolean): MinimalMediaQueryList => ({
    matches,
    addEventListener,
    removeEventListener,
  });

  beforeEach(() => {
    originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'matchMedia',
    );
    matchMediaMock = vi.fn(() => createMediaQueryList(false));
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: matchMediaMock,
    });

    // Reset mocks between tests
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (originalMatchMediaDescriptor) {
      Object.defineProperty(window, 'matchMedia', originalMatchMediaDescriptor);
    } else {
      Reflect.deleteProperty(window, 'matchMedia');
    }
  });

  it('returns correct match state', () => {
    // Test initial state (not matching)
    const {result: resultNotMatching} = renderHook(() =>
      useMediaQuery('(min-width: 768px)'),
    );
    expect(resultNotMatching.current).toBe(false);

    // Change match state to true
    matchMediaMock.mockReturnValue(createMediaQueryList(true));

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
    const handler = addEventListener.mock.calls[0]?.[1];
    expect(typeof handler).toBe('function');
    if (typeof handler !== 'function') {
      throw new TypeError('Expected change event listener to be a function');
    }

    // Simulate media query change
    act(() => {
      handler(Object.assign(new Event('change'), {matches: true}));
    });

    // Verify state updated
    expect(result.current).toBe(true);
  });

  it('cleans up event listener on unmount', () => {
    // Setup
    const {unmount} = renderHook(() => useMediaQuery('(min-width: 768px)'));

    // Verify listener was added
    expect(addEventListener).toHaveBeenCalledOnce();
    expect(addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );

    // Unmount
    unmount();

    // Verify cleanup
    expect(removeEventListener).toHaveBeenCalledOnce();
    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      addEventListener.mock.calls[0]?.[1],
    );
  });
});
