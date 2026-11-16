import {type Category} from '@schema/blog';
import {cleanup, render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {message} from 'antd';
import {type ComponentProps} from 'react';
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

function MockManageView(
  props: ComponentProps<typeof import('./view.js').ManageView>,
) {
  capturedViewProps.current = props;
  return (
    <div>
      {Array.from(props.idToCategory?.values() ?? []).map((category) => (
        <div key={category.id}>
          <span
            role='button'
            tabIndex={0}
            onClick={props.onArticleAmountTagClick(category.id)}
          >
            Article Amount {category.id}
          </span>
          <button
            type='button'
            onClick={props.onDeleteCategoryButtonClick(category.id)}
          >
            Delete {category.id}
          </button>
        </div>
      ))}
      <button type='button' onClick={props.onDeleteCategoryConfirm}>
        Confirm Delete
      </button>
      <button type='button' onClick={props.onArticleDeletedInModal}>
        Article Deleted
      </button>
    </div>
  );
}

vi.mock('./view.js', () => ({
  ManageView: MockManageView,
}));

import {Manage} from './container.js';

function getLatestViewProps() {
  if (capturedViewProps.current === null) {
    throw new Error('Expected ManageView to render');
  }
  return capturedViewProps.current;
}

function createNoopMessageHandle(): ReturnType<typeof message.warning> {
  const settled = Promise.resolve(true);
  return Object.assign(() => undefined, {
    then: settled.then.bind(settled),
  });
}

describe('Category Manage container', () => {
  let originalNavigatorLanguage: string;

  beforeEach(() => {
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
  });

  afterEach(() => {
    cleanup();
    Object.defineProperty(navigator, 'language', {
      get: () => originalNavigatorLanguage,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it('refreshes count after deleting the last article in modal and allows deleting the now-empty category', async () => {
    const user = userEvent.setup();
    render(<Manage />);
    expect(getLatestViewProps().categoryToArticleNumberMap?.get(1)).toBe(1);

    // Open modal for category 1 and simulate deleting its last article.
    await user.click(screen.getByRole('button', {name: 'Article Amount 1'}));
    categoryModelMocks.getArticleAmountById.mockResolvedValueOnce(0);
    await user.click(screen.getByRole('button', {name: 'Article Deleted'}));

    expect(categoryModelMocks.getArticleAmountById).toHaveBeenCalledWith(1);
    expect(getLatestViewProps().categoryToArticleNumberMap?.get(1)).toBe(0);

    // Confirm deleting category 1; live check sees 0 and proceeds to deleteById(1).
    categoryModelMocks.getArticleAmountById.mockResolvedValueOnce(0);
    await user.click(screen.getByRole('button', {name: 'Delete 1'}));
    await user.click(screen.getByRole('button', {name: 'Confirm Delete'}));

    expect(categoryModelMocks.deleteById).toHaveBeenCalledExactlyOnceWith(1);
    expect(getLatestViewProps().idToCategory?.has(1)).toBe(false);
    expect(getLatestViewProps().categoryToArticleNumberMap?.has(1)).toBe(false);
  });

  it('allows deleting a category whose stale cached count was 1 once backend count is 0', async () => {
    const user = userEvent.setup();
    render(<Manage />);
    expect(getLatestViewProps().categoryToArticleNumberMap?.get(1)).toBe(1);

    categoryModelMocks.getArticleAmountById.mockResolvedValueOnce(0);
    await user.click(screen.getByRole('button', {name: 'Delete 1'}));
    await user.click(screen.getByRole('button', {name: 'Confirm Delete'}));

    expect(categoryModelMocks.getArticleAmountById).toHaveBeenCalledWith(1);
    expect(categoryModelMocks.deleteById).toHaveBeenCalledExactlyOnceWith(1);
  });

  it('blocks deleting a non-empty category with localized CATEGORY_IN_USE warning and updates cached count', async () => {
    const warningSpy = vi
      .spyOn(message, 'warning')
      .mockImplementation(createNoopMessageHandle);
    const user = userEvent.setup();
    render(<Manage />);

    categoryModelMocks.getArticleAmountById.mockResolvedValueOnce(3);
    await user.click(screen.getByRole('button', {name: 'Delete 2'}));
    await user.click(screen.getByRole('button', {name: 'Confirm Delete'}));

    expect(categoryModelMocks.deleteById).not.toHaveBeenCalled();
    expect(getLatestViewProps().categoryToArticleNumberMap?.get(2)).toBe(3);
    await vi.waitFor(() => {
      expect(warningSpy).toHaveBeenCalledWith(
        'Category is still used by 3 articles',
      );
    });
  });
});
