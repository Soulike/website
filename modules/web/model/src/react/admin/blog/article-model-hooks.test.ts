// @vitest-environment jsdom

import {type Article} from '@schema/blog';
import {cleanup, renderHook, waitFor} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {ArticleModelHooks} from './article-model-hooks.js';

const sampleArticles: Article[] = [
  {
    id: 1,
    title: 'Hello',
    content: 'Body',
    category: 2,
    publicationTime: '2024-02-29T12:00:00.000Z',
    modificationTime: '2024-02-29T12:00:00.000Z',
    pageViews: 0,
    isVisible: true,
  },
];

function stubFetchJson(payload: unknown) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(Response.json(payload));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('ArticleModelHooks.useIdToArticle', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('invokes onSuccess once and does not re-run when callback identity changes after settlement', async () => {
    stubFetchJson({isSuccessful: true, data: sampleArticles});
    const onSuccessFirst = vi.fn();
    const onSuccessSecond = vi.fn();
    const onRejectFirst = vi.fn();
    const onRejectSecond = vi.fn();

    const {result, rerender} = renderHook(
      ({
        onSuccess,
        onReject,
      }: {
        onSuccess: (map: Map<Article['id'], Article>) => void;
        onReject: (error: Error) => void;
      }) =>
        ArticleModelHooks.useIdToArticle(
          undefined,
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
      expect(result.current.idToArticle).not.toBeNull();
    });

    const initialMap = result.current.idToArticle;
    expect(initialMap?.get(1)).toEqual(sampleArticles[0]);
    expect(onSuccessFirst).toHaveBeenCalledTimes(1);
    expect(onRejectFirst).not.toHaveBeenCalled();

    rerender({
      onSuccess: onSuccessSecond,
      onReject: onRejectSecond,
    });

    await waitFor(() => {
      expect(result.current.idToArticle).toBe(initialMap);
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
      ({onSuccess}: {onSuccess: (map: Map<Article['id'], Article>) => void}) =>
        ArticleModelHooks.useIdToArticle(undefined, onSuccess),
      {
        initialProps: {onSuccess: onSuccessStale},
      },
    );

    rerender({onSuccess: onSuccessLatest});
    resolveFetch?.(Response.json({isSuccessful: true, data: sampleArticles}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.idToArticle).not.toBeNull();
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
        ArticleModelHooks.useIdToArticle(
          undefined,
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
