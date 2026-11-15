import {type Article} from '@schema/blog';
import {cleanup, render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {ConfigProvider} from 'antd';
import enUS from 'antd/locale/en_US.js';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

function MockArticleListItem({article}: {article: Article}) {
  return <div>{article.title}</div>;
}

vi.mock('./components/ArticleListItem', () => ({
  ArticleListItem: MockArticleListItem,
}));

import {ArticleList} from './container.js';

function createArticles(count: number): Article[] {
  return Array.from({length: count}, (_, index) => {
    const id = index + 1;
    return {
      id,
      title: `Post ${id}`,
      content: `Body ${id}`,
      category: 1,
      publicationTime: new Date(1_700_000_000_000 + id).toISOString(),
      modificationTime: new Date(1_700_000_000_000 + id).toISOString(),
      pageViews: id,
      isVisible: true,
    };
  });
}

describe('Blog ArticleList pagination', () => {
  let scrollIntoViewSpy: ReturnType<typeof vi.fn>;
  let originalMatchMediaDescriptor: PropertyDescriptor | undefined;
  let originalScrollIntoViewDescriptor: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'matchMedia',
    );
    originalScrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'scrollIntoView',
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
    scrollIntoViewSpy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: scrollIntoViewSpy,
    });
  });

  afterEach(() => {
    cleanup();
    if (originalMatchMediaDescriptor) {
      Object.defineProperty(window, 'matchMedia', originalMatchMediaDescriptor);
    } else {
      Reflect.deleteProperty(window, 'matchMedia');
    }
    if (originalScrollIntoViewDescriptor) {
      Object.defineProperty(
        HTMLElement.prototype,
        'scrollIntoView',
        originalScrollIntoViewDescriptor,
      );
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
    }
    vi.restoreAllMocks();
  });

  it('slices pages via Pagination, scrolls into view on change, and clamps when the article list shrinks', async () => {
    const user = userEvent.setup();
    const articles11 = createArticles(11);
    const {rerender} = render(
      <ConfigProvider locale={enUS}>
        <ArticleList articles={articles11} loading={false} />
      </ConfigProvider>,
    );

    expect(screen.getByText('Post 1')).toBeTruthy();
    expect(screen.getByText('Post 10')).toBeTruthy();
    expect(screen.queryByText('Post 11')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 1'}).getAttribute('aria-current'),
    ).toBe('page');

    await user.click(screen.getByRole('button', {name: 'Page 2'}));

    expect(screen.getByText('Post 11')).toBeTruthy();
    expect(screen.queryByText('Post 1')).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Page 2'}).getAttribute('aria-current'),
    ).toBe('page');
    expect(scrollIntoViewSpy).toHaveBeenCalledWith(true);

    // Navigating to a smaller list while on page 2 clamps back to page 1.
    const articles3 = createArticles(3);
    rerender(
      <ConfigProvider locale={enUS}>
        <ArticleList articles={articles3} loading={false} />
      </ConfigProvider>,
    );

    expect(screen.getByText('Post 1')).toBeTruthy();
    expect(screen.getByText('Post 3')).toBeTruthy();
    expect(screen.queryByText('Post 11')).toBeNull();
  });
});
