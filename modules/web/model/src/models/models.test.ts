import {afterEach, describe, expect, it, vi} from 'vitest';

import {AccountModel, BlogModels as AdminBlogModels} from './admin/index.js';
import {articleModel, categoryModel, optionModel} from './blog/index.js';
import {ModelAccessDeniedError} from './model-access-error.js';

function stubFetchJson(payload: unknown) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(Response.json(payload));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const sampleArticle = {
  id: 1,
  title: 'Hello',
  content: 'Body',
  category: 2,
  publicationTime: '2024-02-29T12:00:00.000Z',
  modificationTime: '2024-02-29T12:00:00.000Z',
  pageViews: 0,
  isVisible: true,
};

describe('@module/model RPC validation and error propagation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('validates data-bearing responses and returns parsed data', async () => {
    const adminArticleModel = new AdminBlogModels.ArticleModel();
    stubFetchJson({isSuccessful: true, data: [sampleArticle]});
    await expect(adminArticleModel.getAll()).resolves.toEqual([sampleArticle]);

    stubFetchJson({isSuccessful: true, data: sampleArticle});
    await expect(articleModel.getById(1)).resolves.toEqual(sampleArticle);

    stubFetchJson({isSuccessful: true, data: [{id: 1, name: 'Tech'}]});
    await expect(categoryModel.getAll()).resolves.toEqual([
      {id: 1, name: 'Tech'},
    ]);

    stubFetchJson({isSuccessful: true, data: {about: '# About'}});
    await expect(optionModel.getAbout()).resolves.toBe('# About');

    const accountModel = new AccountModel();
    stubFetchJson({isSuccessful: true, data: {isInSession: true}});
    await expect(accountModel.isLoggedIn()).resolves.toBe(true);
  });

  it('validates void responses against VoidServerResponseSchema (requiring data: null)', async () => {
    const adminArticleModel = new AdminBlogModels.ArticleModel();
    const adminCategoryModel = new AdminBlogModels.CategoryModel();
    const adminOptionModel = new AdminBlogModels.OptionModel();
    const accountModel = new AccountModel();

    stubFetchJson({isSuccessful: true, data: null});
    await expect(
      adminArticleModel.add({
        title: 'Hello',
        content: 'World',
        category: 1,
        isVisible: true,
      }),
    ).resolves.toBeUndefined();

    stubFetchJson({isSuccessful: true, data: null});
    await expect(adminCategoryModel.deleteById(1)).resolves.toBeUndefined();

    stubFetchJson({isSuccessful: true, data: null});
    await expect(adminOptionModel.setAbout('# About')).resolves.toBeUndefined();

    stubFetchJson({isSuccessful: true, data: null});
    await expect(accountModel.logout()).resolves.toBeUndefined();

    // Omitted data field or undefined-like non-null data must fail as malformed.
    stubFetchJson({isSuccessful: true});
    await expect(adminArticleModel.deleteById(1)).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof Error &&
        error.constructor === Error &&
        !(error instanceof ModelAccessDeniedError),
    );
  });

  it('throws ModelAccessDeniedError carrying structured ServerError on business failures', async () => {
    const adminCategoryModel = new AdminBlogModels.CategoryModel();

    stubFetchJson({
      isSuccessful: false,
      error: {code: 'CATEGORY_IN_USE', details: {articleAmount: 5}},
    });
    await expect(adminCategoryModel.deleteById(1)).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof ModelAccessDeniedError &&
        error.serverError.code === 'CATEGORY_IN_USE' &&
        error.serverError.details.articleAmount === 5,
    );

    stubFetchJson({
      isSuccessful: false,
      error: {code: 'ARTICLE_NOT_FOUND'},
    });
    await expect(articleModel.getById(99)).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof ModelAccessDeniedError &&
        error.serverError.code === 'ARTICLE_NOT_FOUND',
    );
  });

  it.each([
    {isSuccessful: false, message: 'legacy string message'},
    {isSuccessful: false, error: {code: 'UNKNOWN_ERROR'}},
    {isSuccessful: false, error: {code: 'CATEGORY_IN_USE'}},
    {isSuccessful: true, data: [{...sampleArticle, publicationTime: 123}]},
    'not-an-object',
  ])(
    'throws plain Error (not ModelAccessDeniedError) on malformed payload %j',
    async (malformedPayload) => {
      const adminArticleModel = new AdminBlogModels.ArticleModel();
      stubFetchJson(malformedPayload);

      await expect(adminArticleModel.getAll()).rejects.toSatisfy(
        (error: unknown) =>
          error instanceof Error &&
          error.constructor === Error &&
          !(error instanceof ModelAccessDeniedError),
      );
    },
  );
});
