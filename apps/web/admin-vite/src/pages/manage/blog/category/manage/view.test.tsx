import {type Category} from '@schema/blog';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {ConfigProvider} from 'antd';
import enUS from 'antd/locale/en_US.js';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const categoryModelMocks = vi.hoisted(() => ({
  getArticleAmountById: vi.fn<(id: number) => Promise<number>>(),
  deleteById: vi.fn<(id: number) => Promise<void>>(),
  modify:
    vi.fn<(id: number, modifiedParts: {name?: string}) => Promise<void>>(),
}));

const hookMocks = vi.hoisted(() => ({
  categories: new Map<number, Category>(),
  articleAmounts: new Map<number, number>(),
}));

function mockUseIdToCategory() {
  return {
    idToCategory: hookMocks.categories,
    loading: false,
    error: null,
  };
}

function mockUseIdToArticleAmount() {
  return {
    idToArticleAmount: hookMocks.articleAmounts,
    loading: false,
    error: null,
  };
}

function MockEmptyComponent() {
  return null;
}

vi.mock('@module/model/admin', () => ({
  BlogModels: {
    CategoryModel: class {
      getArticleAmountById = categoryModelMocks.getArticleAmountById;
      deleteById = categoryModelMocks.deleteById;
      modify = categoryModelMocks.modify;
    },
  },
}));

vi.mock('@module/model/react/admin', () => ({
  BlogModelHooks: {
    CategoryModelHooks: {
      useIdToCategory: mockUseIdToCategory,
      useIdToArticleAmount: mockUseIdToArticleAmount,
    },
  },
}));

vi.mock('./components/ArticleListModal', () => ({
  ArticleListModal: MockEmptyComponent,
}));

vi.mock('./components/ModifyModal', () => ({
  ModifyModal: MockEmptyComponent,
}));

import {Manage} from './container.js';

function createCategories(count: number): {
  categories: Map<number, Category>;
  amounts: Map<number, number>;
} {
  const categories = new Map<number, Category>();
  const amounts = new Map<number, number>();
  for (let id = 1; id <= count; id += 1) {
    categories.set(id, {id, name: `Category ${id}`});
    amounts.set(id, 0);
  }
  return {categories, amounts};
}

describe('Category Manage Listy pagination', () => {
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

    const {categories, amounts} = createCategories(11);
    hookMocks.categories = categories;
    hookMocks.articleAmounts = amounts;

    categoryModelMocks.getArticleAmountById.mockReset().mockResolvedValue(0);
    categoryModelMocks.deleteById.mockReset().mockResolvedValue(undefined);
    categoryModelMocks.modify.mockReset().mockResolvedValue(undefined);
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
        <Manage />
      </ConfigProvider>,
    );

    expect(await screen.findByText('Category 1')).toBeTruthy();
    expect(screen.getByText('Category 10')).toBeTruthy();
    expect(screen.queryByText('Category 11')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 1'}).getAttribute('aria-current'),
    ).toBe('page');

    await user.click(screen.getByRole('button', {name: 'Page 2'}));

    expect(screen.getByText('Category 11')).toBeTruthy();
    expect(screen.queryByText('Category 1')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 2'}).getAttribute('aria-current'),
    ).toBe('page');

    await user.click(screen.getByRole('combobox', {name: 'Page Size'}));
    await user.click(screen.getByText('5 / page'));

    expect(screen.getByText('Category 6')).toBeTruthy();
    expect(screen.getByText('Category 10')).toBeTruthy();
    expect(screen.queryByText('Category 5')).toBeNull();
    expect(screen.queryByText('Category 11')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 2'}).getAttribute('aria-current'),
    ).toBe('page');
  });

  it('clamps the active page and slice when deleting the sole category on the last page', async () => {
    const {categories, amounts} = createCategories(21);
    hookMocks.categories = categories;
    hookMocks.articleAmounts = amounts;

    const user = userEvent.setup();
    render(
      <ConfigProvider locale={enUS}>
        <Manage />
      </ConfigProvider>,
    );

    expect(await screen.findByText('Category 1')).toBeTruthy();
    await user.click(screen.getByRole('button', {name: 'Page 3'}));

    expect(screen.getByText('Category 21')).toBeTruthy();
    expect(
      screen.getByRole('button', {name: 'Page 3'}).getAttribute('aria-current'),
    ).toBe('page');

    await user.click(screen.getByRole('button', {name: 'delete'}));
    await user.click(screen.getByRole('button', {name: 'OK'}));

    await waitFor(() => {
      expect(categoryModelMocks.deleteById).toHaveBeenCalledWith(21);
    });
    expect(await screen.findByText('Category 11')).toBeTruthy();
    expect(screen.getByText('Category 20')).toBeTruthy();
    expect(screen.queryByText('Category 21')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 2'}).getAttribute('aria-current'),
    ).toBe('page');
  });
});
