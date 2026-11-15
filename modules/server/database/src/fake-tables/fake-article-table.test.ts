import {beforeEach, describe, expect, it} from 'vitest';

import {FakeArticleTable} from './fake-article-table.js';

describe('FakeArticleTable', () => {
  const publishedAtMs = Date.UTC(2026, 0, 15, 12, 0, 0);
  const modifiedAtMs = Date.UTC(2026, 0, 16, 8, 30, 0);

  beforeEach(async () => {
    FakeArticleTable.reset();
    await FakeArticleTable.insert({
      title: 'First Article',
      content: 'Body',
      category: 1,
      publicationTime: new Date(publishedAtMs),
      modificationTime: new Date(modifiedAtMs),
      pageViews: 5,
      isVisible: true,
    });
  });

  it('matches Date filters in select by timestamp rather than object identity', async () => {
    const byPublication = await FakeArticleTable.select({
      publicationTime: new Date(publishedAtMs),
    });
    expect(byPublication).toHaveLength(1);
    expect(byPublication[0]?.title).toBe('First Article');

    const byModification = await FakeArticleTable.select({
      modificationTime: new Date(modifiedAtMs),
    });
    expect(byModification).toHaveLength(1);

    const byDifferentTimestamp = await FakeArticleTable.select({
      publicationTime: new Date(publishedAtMs + 1_000),
    });
    expect(byDifferentTimestamp).toEqual([]);
  });

  it('matches Date filters in count by timestamp rather than object identity', async () => {
    await expect(
      FakeArticleTable.count({publicationTime: new Date(publishedAtMs)}),
    ).resolves.toBe(1);
    await expect(
      FakeArticleTable.count({modificationTime: new Date(modifiedAtMs)}),
    ).resolves.toBe(1);
    await expect(
      FakeArticleTable.count({
        publicationTime: new Date(publishedAtMs + 1_000),
      }),
    ).resolves.toBe(0);
  });

  it('retains exact matching for primitive filters', async () => {
    const matched = await FakeArticleTable.select({
      category: 1,
      isVisible: true,
    });
    expect(matched).toHaveLength(1);

    await expect(FakeArticleTable.count({category: 2})).resolves.toBe(0);
  });
});
