import {ModelAccessDeniedError} from '@module/model';
import {type ServerError} from '@schema/rpc';
import {notification} from 'antd';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {
  getServerErrorMessage,
  showErrorNotification,
} from './error-notification-helper.js';

describe('blog-vite error-notification-helper', () => {
  let originalNavigatorLanguage: string;
  let mockNavigatorLanguage: string;

  beforeEach(() => {
    originalNavigatorLanguage = navigator.language;
    mockNavigatorLanguage = 'en';
    Object.defineProperty(navigator, 'language', {
      get: () => mockNavigatorLanguage,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'language', {
      get: () => originalNavigatorLanguage,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it.each<[string, ServerError, string]>([
    ['en', {code: 'INVALID_REQUEST_PARAMS'}, 'Invalid request parameters'],
    ['zh-cn', {code: 'INVALID_REQUEST_PARAMS'}, '请求参数错误'],
    ['en', {code: 'INVALID_DATE'}, 'Invalid date'],
    ['zh-cn', {code: 'INVALID_DATE'}, '日期无效'],
    ['en', {code: 'UNAUTHORIZED'}, 'Please log in first'],
    ['zh-cn', {code: 'UNAUTHORIZED'}, '请先登录'],
    ['en', {code: 'ACCOUNT_NOT_FOUND'}, 'Account does not exist'],
    ['zh-cn', {code: 'ACCOUNT_NOT_FOUND'}, '用户不存在'],
    ['en', {code: 'ACCOUNT_ALREADY_EXISTS'}, 'Username already exists'],
    ['zh-cn', {code: 'ACCOUNT_ALREADY_EXISTS'}, '用户名已存在'],
    ['en', {code: 'CATEGORY_NOT_FOUND'}, 'Category does not exist'],
    ['zh-cn', {code: 'CATEGORY_NOT_FOUND'}, '文章分类不存在'],
    ['en', {code: 'CATEGORY_ALREADY_EXISTS'}, 'Category already exists'],
    ['zh-cn', {code: 'CATEGORY_ALREADY_EXISTS'}, '分类已存在'],
    [
      'en',
      {code: 'CATEGORY_IN_USE', details: {articleAmount: 2}},
      'Category is still used by 2 articles',
    ],
    [
      'zh-cn',
      {code: 'CATEGORY_IN_USE', details: {articleAmount: 2}},
      '文章分类仍被 2 篇文章使用，无法删除',
    ],
    ['en', {code: 'ARTICLE_NOT_FOUND'}, 'Article does not exist'],
    ['zh-cn', {code: 'ARTICLE_NOT_FOUND'}, '文章不存在'],
    [
      'en',
      {code: 'ARTICLE_TITLE_ALREADY_EXISTS'},
      'Article title already exists',
    ],
    ['zh-cn', {code: 'ARTICLE_TITLE_ALREADY_EXISTS'}, '文章标题已存在'],
    [
      'en',
      {code: 'ARTICLE_CATEGORY_NOT_FOUND'},
      'Article category does not exist',
    ],
    [
      'zh-cn',
      {code: 'ARTICLE_CATEGORY_NOT_FOUND'},
      '文章分类不存在，请重新选择分类',
    ],
  ])(
    'translates %s ServerError %j to %s',
    async (language, serverError, expectedMessage) => {
      mockNavigatorLanguage = language;
      await expect(getServerErrorMessage(serverError)).resolves.toBe(
        expectedMessage,
      );
    },
  );

  it('shows localized notification for ModelAccessDeniedError and generic network error for plain Error', async () => {
    const errorSpy = vi
      .spyOn(notification, 'error')
      .mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    mockNavigatorLanguage = 'en';
    showErrorNotification(
      new ModelAccessDeniedError({code: 'ARTICLE_NOT_FOUND'}),
    );
    await vi.waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith({
        title: 'Article does not exist',
      });
    });

    mockNavigatorLanguage = 'zh-cn';
    showErrorNotification(new Error('Malformed response'));
    await vi.waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith({title: '网络错误'});
    });
  });
});
