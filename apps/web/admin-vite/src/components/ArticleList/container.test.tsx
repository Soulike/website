import {type Article} from '@schema/blog';
import {act, cleanup, render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {ConfigProvider} from 'antd';
import enUS from 'antd/locale/en_US.js';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const hookMocks = vi.hoisted(() => ({
  idToArticle: new Map<number, Article>(),
  pendingDeletions: new Map<number, () => void>(),
}));

function mockUseIdToArticle() {
  return {
    idToArticle: hookMocks.idToArticle,
    loading: false,
    error: null,
  };
}

function MockArticleListItem({
  id,
  onDeleteArticleSuccess,
}: {
  id: number;
  onDeleteArticleSuccess: (id: number) => void;
}) {
  return (
    <div>
      <span>Article {id}</span>
      <button
        type='button'
        onClick={() => {
          onDeleteArticleSuccess(id);
        }}
      >
        Delete Article {id}
      </button>
      <button
        type='button'
        onClick={() => {
          hookMocks.pendingDeletions.set(id, () => {
            onDeleteArticleSuccess(id);
          });
        }}
      >
        Start Delete Article {id}
      </button>
    </div>
  );
}

vi.mock('@module/model/react/admin', () => ({
  BlogModelHooks: {
    ArticleModelHooks: {
      useIdToArticle: mockUseIdToArticle,
    },
  },
}));

vi.mock('./components/ArticleListItem', () => ({
  ArticleListItem: MockArticleListItem,
}));

import {ArticleList} from './container.js';

function createArticlesMap(count: number): Map<number, Article> {
  return new Map(
    Array.from({length: count}, (_, index) => {
      const id = index + 1;
      return [
        id,
        {
          id,
          title: `Article ${id}`,
          content: `Content ${id}`,
          category: 1,
          publicationTime: new Date(1_700_000_000_000 + id).toISOString(),
          modificationTime: new Date(1_700_000_000_000 + id).toISOString(),
          pageViews: 0,
          isVisible: true,
        },
      ];
    }),
  );
}

describe('Admin ArticleList pagination', () => {
  let originalMatchMediaDescriptor: PropertyDescriptor | undefined;
  let originalResizeObserverDescriptor: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'matchMedia',
    );
    originalResizeObserverDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'ResizeObserver',
    );
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      },
    });
    hookMocks.idToArticle = createArticlesMap(11);
    hookMocks.pendingDeletions.clear();
  });

  afterEach(() => {
    cleanup();
    if (originalMatchMediaDescriptor) {
      Object.defineProperty(window, 'matchMedia', originalMatchMediaDescriptor);
    } else {
      Reflect.deleteProperty(window, 'matchMedia');
    }
    if (originalResizeObserverDescriptor) {
      Object.defineProperty(
        globalThis,
        'ResizeObserver',
        originalResizeObserverDescriptor,
      );
    } else {
      Reflect.deleteProperty(globalThis, 'ResizeObserver');
    }
    vi.restoreAllMocks();
  });

  it('slices pages and updates page size via Pagination', async () => {
    const user = userEvent.setup();
    render(
      <ConfigProvider locale={enUS}>
        <ArticleList />
      </ConfigProvider>,
    );

    expect(await screen.findByText('Article 1')).toBeTruthy();
    expect(screen.getByText('Article 10')).toBeTruthy();
    expect(screen.queryByText('Article 11')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 1'}).getAttribute('aria-current'),
    ).toBe('page');

    await user.click(screen.getByRole('button', {name: 'Page 2'}));

    expect(screen.getByText('Article 11')).toBeTruthy();
    expect(screen.queryByText('Article 1')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 2'}).getAttribute('aria-current'),
    ).toBe('page');

    await user.click(screen.getByRole('combobox', {name: 'Page Size'}));
    await user.click(screen.getByText('5 / page'));

    expect(screen.getByText('Article 6')).toBeTruthy();
    expect(screen.getByText('Article 10')).toBeTruthy();
    expect(screen.queryByText('Article 5')).toBeNull();
    expect(screen.queryByText('Article 11')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 2'}).getAttribute('aria-current'),
    ).toBe('page');
  });

  it('clamps the active page and slice when deleting the sole item on the last page', async () => {
    hookMocks.idToArticle = createArticlesMap(21);
    const user = userEvent.setup();
    render(
      <ConfigProvider locale={enUS}>
        <ArticleList />
      </ConfigProvider>,
    );

    expect(await screen.findByText('Article 1')).toBeTruthy();
    await user.click(screen.getByRole('button', {name: 'Page 3'}));

    expect(screen.getByText('Article 21')).toBeTruthy();
    expect(
      screen.getByRole('button', {name: 'Page 3'}).getAttribute('aria-current'),
    ).toBe('page');

    await user.click(screen.getByRole('button', {name: 'Delete Article 21'}));

    expect(screen.getByText('Article 11')).toBeTruthy();
    expect(screen.getByText('Article 20')).toBeTruthy();
    expect(screen.queryByText('Article 21')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 2'}).getAttribute('aria-current'),
    ).toBe('page');
  });

  it('retains both removals when two overlapping deletions capture the initial callback and settle sequentially', async () => {
    const user = userEvent.setup();
    render(
      <ConfigProvider locale={enUS}>
        <ArticleList />
      </ConfigProvider>,
    );

    expect(await screen.findByText('Article 1')).toBeTruthy();
    expect(screen.getByText('Article 2')).toBeTruthy();

    await user.click(
      screen.getByRole('button', {name: 'Start Delete Article 1'}),
    );
    await user.click(
      screen.getByRole('button', {name: 'Start Delete Article 2'}),
    );

    const resolveFirst = hookMocks.pendingDeletions.get(1);
    const resolveSecond = hookMocks.pendingDeletions.get(2);
    expect(resolveFirst).toBeDefined();
    expect(resolveSecond).toBeDefined();

    act(() => {
      resolveFirst?.();
    });
    expect(screen.queryByText('Article 1')).toBeNull();
    expect(screen.getByText('Article 2')).toBeTruthy();

    act(() => {
      resolveSecond?.();
    });
    expect(screen.queryByText('Article 1')).toBeNull();
    expect(screen.queryByText('Article 2')).toBeNull();
    expect(screen.getByText('Article 11')).toBeTruthy();
  });
});
