// @vitest-environment jsdom

import {type Category} from '@schema/blog';
import {cleanup, renderHook, waitFor} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {CategoryModelHooks} from './category-model-hooks.js';

const sampleCategories: Category[] = [
  {id: 1, name: 'Tech'},
  {id: 2, name: 'Life'},
];

function stubFetchJson(payload: unknown) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(Response.json(payload));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('CategoryModelHooks.useIdToCategory', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('invokes onSuccess once and does not re-run when callback identity changes after settlement', async () => {
    stubFetchJson({isSuccessful: true, data: sampleCategories});
    const onSuccessFirst = vi.fn();
    const onSuccessSecond = vi.fn();
    const onRejectFirst = vi.fn();
    const onRejectSecond = vi.fn();

    const {result, rerender} = renderHook(
      ({
        onSuccess,
        onReject,
      }: {
        onSuccess: (map: Map<Category['id'], Category>) => void;
        onReject: (error: Error) => void;
      }) =>
        CategoryModelHooks.useIdToCategory(
          (map) => {
            onSuccess(map);
          },
          (error) => {
            onReject(error);
          },
        ),
      {
        initialProps: {
          onSuccess: onSuccessFirst,
          onReject: onRejectFirst,
        },
      },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.idToCategory).not.toBeNull();
    });

    const initialMap = result.current.idToCategory;
    expect(initialMap?.get(1)).toEqual({id: 1, name: 'Tech'});
    expect(initialMap?.get(2)).toEqual({id: 2, name: 'Life'});
    expect(onSuccessFirst).toHaveBeenCalledTimes(1);
    expect(onRejectFirst).not.toHaveBeenCalled();

    rerender({
      onSuccess: onSuccessSecond,
      onReject: onRejectSecond,
    });

    await waitFor(() => {
      expect(result.current.idToCategory).toBe(initialMap);
    });
    expect(onSuccessFirst).toHaveBeenCalledTimes(1);
    expect(onSuccessSecond).not.toHaveBeenCalled();
  });

  it('invokes the latest onSuccess callback when updated before the request settles', async () => {
    let resolveFetch: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const onSuccessStale = vi.fn();
    const onSuccessLatest = vi.fn();

    const {result, rerender} = renderHook(
      ({
        onSuccess,
      }: {
        onSuccess: (map: Map<Category['id'], Category>) => void;
      }) => CategoryModelHooks.useIdToCategory(onSuccess),
      {
        initialProps: {onSuccess: onSuccessStale},
      },
    );

    rerender({onSuccess: onSuccessLatest});
    resolveFetch?.(Response.json({isSuccessful: true, data: sampleCategories}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.idToCategory).not.toBeNull();
    });

    expect(onSuccessStale).not.toHaveBeenCalled();
    expect(onSuccessLatest).toHaveBeenCalledTimes(1);
  });

  it('invokes onReject once on failure even when callback identity changes across rerenders', async () => {
    stubFetchJson({
      isSuccessful: false,
      error: {code: 'INTERNAL_SERVER_ERROR'},
    });
    const onSuccess = vi.fn();
    const onRejectFirst = vi.fn();
    const onRejectSecond = vi.fn();

    const {result, rerender} = renderHook(
      ({onReject}: {onReject: (error: Error) => void}) =>
        CategoryModelHooks.useIdToCategory(
          (map) => {
            onSuccess(map);
          },
          (error) => {
            onReject(error);
          },
        ),
      {
        initialProps: {onReject: onRejectFirst},
      },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
    });

    expect(onRejectFirst).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();

    rerender({onReject: onRejectSecond});

    expect(onRejectFirst).toHaveBeenCalledTimes(1);
    expect(onRejectSecond).not.toHaveBeenCalled();
  });
});
