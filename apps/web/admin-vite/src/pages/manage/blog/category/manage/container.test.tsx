import {type Category} from '@schema/blog';
import {message} from 'antd';
import {act, type ComponentProps} from 'react';
import {createRoot, type Root} from 'react-dom/client';
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

const capturedViewProps = vi.hoisted(() => ({
  current: null as ComponentProps<typeof import('./view.js').ManageView> | null,
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

vi.mock('./view.js', () => ({
  ManageView: (
    props: ComponentProps<typeof import('./view.js').ManageView>,
  ) => {
    capturedViewProps.current = props;
    return null;
  },
}));

import {Manage} from './container.js';

function getLatestViewProps() {
  if (capturedViewProps.current === null) {
    throw new Error('Expected ManageView to render');
  }
  return capturedViewProps.current;
}

describe('Category Manage container', () => {
  let containerElement: HTMLDivElement;
  let root: Root;
  let originalNavigatorLanguage: string;

  beforeEach(() => {
    (
      globalThis as {IS_REACT_ACT_ENVIRONMENT?: boolean}
    ).IS_REACT_ACT_ENVIRONMENT = true;
    originalNavigatorLanguage = navigator.language;
    Object.defineProperty(navigator, 'language', {
      get: () => 'en',
      configurable: true,
    });

    hookMocks.categories = new Map([
      [1, {id: 1, name: 'Tech'}],
      [2, {id: 2, name: 'Life'}],
    ]);
    hookMocks.articleAmounts = new Map([
      [1, 1],
      [2, 0],
    ]);

    categoryModelMocks.getArticleAmountById.mockReset();
    categoryModelMocks.deleteById.mockReset().mockResolvedValue(undefined);
    categoryModelMocks.modify.mockReset().mockResolvedValue(undefined);
    capturedViewProps.current = null;

    containerElement = document.createElement('div');
    document.body.appendChild(containerElement);
    root = createRoot(containerElement);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
      await Promise.resolve();
    });
    containerElement.remove();
    Object.defineProperty(navigator, 'language', {
      get: () => originalNavigatorLanguage,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  async function renderManage() {
    await act(async () => {
      root.render(<Manage />);
      await Promise.resolve();
    });
    return getLatestViewProps();
  }

  it('refreshes count after deleting the last article in modal and allows deleting the now-empty category', async () => {
    let viewProps = await renderManage();
    expect(viewProps.categoryToArticleNumberMap?.get(1)).toBe(1);

    // Open modal for category 1 and simulate deleting its last article.
    await act(async () => {
      viewProps.onArticleAmountTagClick(1)?.({
        preventDefault: () => undefined,
      } as never);
      await Promise.resolve();
    });
    categoryModelMocks.getArticleAmountById.mockResolvedValueOnce(0);
    await act(async () => {
      getLatestViewProps().onArticleDeletedInModal?.();
      await Promise.resolve();
    });

    viewProps = getLatestViewProps();
    expect(categoryModelMocks.getArticleAmountById).toHaveBeenCalledWith(1);
    expect(viewProps.categoryToArticleNumberMap?.get(1)).toBe(0);

    // Confirm deleting category 1; live check sees 0 and proceeds to deleteById(1).
    categoryModelMocks.getArticleAmountById.mockResolvedValueOnce(0);
    await act(async () => {
      viewProps.onDeleteCategoryButtonClick(1)?.({} as never);
      await Promise.resolve();
    });
    await act(async () => {
      getLatestViewProps().onDeleteCategoryConfirm?.();
      await Promise.resolve();
    });

    expect(categoryModelMocks.deleteById).toHaveBeenCalledExactlyOnceWith(1);
    expect(getLatestViewProps().idToCategory?.has(1)).toBe(false);
    expect(getLatestViewProps().categoryToArticleNumberMap?.has(1)).toBe(false);
  });

  it('allows deleting a category whose stale cached count was 1 once backend count is 0', async () => {
    const viewProps = await renderManage();
    expect(viewProps.categoryToArticleNumberMap?.get(1)).toBe(1);

    categoryModelMocks.getArticleAmountById.mockResolvedValueOnce(0);
    await act(async () => {
      viewProps.onDeleteCategoryButtonClick(1)?.({} as never);
      await Promise.resolve();
    });
    await act(async () => {
      getLatestViewProps().onDeleteCategoryConfirm?.();
      await Promise.resolve();
    });

    expect(categoryModelMocks.getArticleAmountById).toHaveBeenCalledWith(1);
    expect(categoryModelMocks.deleteById).toHaveBeenCalledExactlyOnceWith(1);
  });

  it('blocks deleting a non-empty category with localized CATEGORY_IN_USE warning and updates cached count', async () => {
    const warningSpy = vi
      .spyOn(message, 'warning')
      .mockImplementation(() => undefined as never);
    const viewProps = await renderManage();

    categoryModelMocks.getArticleAmountById.mockResolvedValueOnce(3);
    await act(async () => {
      viewProps.onDeleteCategoryButtonClick(2)?.({} as never);
      await Promise.resolve();
    });
    await act(async () => {
      getLatestViewProps().onDeleteCategoryConfirm?.();
      await Promise.resolve();
    });

    expect(categoryModelMocks.deleteById).not.toHaveBeenCalled();
    expect(getLatestViewProps().categoryToArticleNumberMap?.get(2)).toBe(3);
    await vi.waitFor(() => {
      expect(warningSpy).toHaveBeenCalledWith(
        'Category is still used by 3 articles',
      );
    });
  });
});
