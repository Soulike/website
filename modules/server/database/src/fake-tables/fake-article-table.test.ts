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

  it('isolates stored timestamps from mutations to insert, update, and selected Dates', async () => {
    const inputPub = new Date(Date.UTC(2026, 1, 1, 0, 0, 0));
    const inputMod = new Date(Date.UTC(2026, 1, 2, 0, 0, 0));
    await FakeArticleTable.insert({
      title: 'Isolated Article',
      content: 'Body',
      category: 1,
      publicationTime: inputPub,
      modificationTime: inputMod,
      pageViews: 0,
      isVisible: true,
    });

    inputPub.setUTCFullYear(2000);
    inputMod.setUTCFullYear(2001);

    const inserted = await FakeArticleTable.selectById(2);
    expect(inserted?.publicationTime.getTime()).toBe(
      Date.UTC(2026, 1, 1, 0, 0, 0),
    );
    expect(inserted?.modificationTime.getTime()).toBe(
      Date.UTC(2026, 1, 2, 0, 0, 0),
    );

    inserted?.publicationTime.setUTCFullYear(1999);
    const afterSelectByIdMutation = await FakeArticleTable.selectById(2);
    expect(afterSelectByIdMutation?.publicationTime.getTime()).toBe(
      Date.UTC(2026, 1, 1, 0, 0, 0),
    );

    const listed = await FakeArticleTable.select({title: 'Isolated Article'});
    listed[0]?.modificationTime.setUTCFullYear(1998);
    const afterSelectMutation = await FakeArticleTable.selectById(2);
    expect(afterSelectMutation?.modificationTime.getTime()).toBe(
      Date.UTC(2026, 1, 2, 0, 0, 0),
    );

    const updateMod = new Date(Date.UTC(2026, 2, 10, 0, 0, 0));
    await FakeArticleTable.updateById(2, {modificationTime: updateMod});
    updateMod.setUTCFullYear(2010);
    const afterUpdateMutation = await FakeArticleTable.selectById(2);
    expect(afterUpdateMutation?.modificationTime.getTime()).toBe(
      Date.UTC(2026, 2, 10, 0, 0, 0),
    );
  });
});
