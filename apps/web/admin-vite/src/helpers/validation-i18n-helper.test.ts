import {LoginCredentialsSchema} from '@schema/auth';
import {
  ArticleDraftSchema,
  CategoryDraftSchema,
  SiteOptionSchema,
} from '@schema/blog';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {z} from 'zod';

import {
  ARTICLE_DRAFT_FIELD_LABELS,
  CATEGORY_DRAFT_FIELD_LABELS,
  getValidationErrorMessage,
  LOGIN_CREDENTIALS_FIELD_LABELS,
  SITE_OPTION_FIELD_LABELS,
  validateFormSchema,
  type ValidationFieldLabels,
} from './validation-i18n-helper.js';

describe('validation-i18n-helper', () => {
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

  async function validateLoginAndFormat(input: unknown): Promise<string> {
    const parsed = LoginCredentialsSchema.safeParse(input);
    expect(parsed.success).toBe(false);
    if (parsed.success) {
      throw new Error('Expected validation to fail');
    }
    const firstIssue = parsed.error.issues[0];
    expect(firstIssue).toBeDefined();
    return getValidationErrorMessage(
      firstIssue,
      LOGIN_CREDENTIALS_FIELD_LABELS,
    );
  }

  it.each([
    ['en', {username: '', password: 'secret'}, 'Please enter Username'],
    ['zh-cn', {username: '', password: 'secret'}, '请输入用户名'],
    ['en', {username: 'alice', password: ''}, 'Please enter Password'],
    ['zh-cn', {username: 'alice', password: ''}, '请输入密码'],
    [
      'en',
      {username: ' alice ', password: 'secret'},
      'Username cannot start or end with spaces',
    ],
    ['zh-cn', {username: '   ', password: 'secret'}, '用户名首尾不能包含空格'],
    [
      'en',
      {username: 'a'.repeat(256), password: 'secret'},
      'Username must be at most 255 characters',
    ],
    [
      'zh-cn',
      {username: 'a'.repeat(256), password: 'secret'},
      '用户名最多不能超过 255 个字符',
    ],
  ])(
    'formats LoginCredentials failure in %s for %j',
    async (language, payload, expectedMessage) => {
      mockNavigatorLanguage = language;
      await expect(validateLoginAndFormat(payload)).resolves.toBe(
        expectedMessage,
      );
    },
  );

  it('formats minimum > 1 too_small issues with the minimum length argument', async () => {
    const issue: z.core.$ZodIssue = {
      code: 'too_small',
      origin: 'string',
      minimum: 3,
      inclusive: true,
      path: ['username'],
      message: 'Too small',
    };

    mockNavigatorLanguage = 'en';
    await expect(
      getValidationErrorMessage(issue, LOGIN_CREDENTIALS_FIELD_LABELS),
    ).resolves.toBe('Username must be at least 3 characters');

    mockNavigatorLanguage = 'zh-cn';
    await expect(
      getValidationErrorMessage(issue, LOGIN_CREDENTIALS_FIELD_LABELS),
    ).resolves.toBe('用户名至少需要 3 个字符');
  });

  it.each<[string, z.core.$ZodIssue]>([
    [
      'invalid_type',
      {
        code: 'invalid_type',
        expected: 'string',
        path: ['username'],
        message: 'Invalid type',
      },
    ],
    [
      'invalid_format',
      {
        code: 'invalid_format',
        format: 'regex',
        path: ['username'],
        message: 'Invalid format',
      },
    ],
    [
      'invalid_value',
      {
        code: 'invalid_value',
        values: ['a'],
        path: ['username'],
        message: 'Invalid value',
      },
    ],
    [
      'invalid_union',
      {
        code: 'invalid_union',
        errors: [],
        path: ['username'],
        message: 'Invalid union',
      },
    ],
    [
      'invalid_key',
      {
        code: 'invalid_key',
        origin: 'record',
        issues: [],
        path: ['username'],
        message: 'Invalid key',
      },
    ],
    [
      'invalid_element',
      {
        code: 'invalid_element',
        origin: 'map',
        key: 0,
        issues: [],
        path: ['username'],
        message: 'Invalid element',
      },
    ],
    [
      'not_multiple_of',
      {
        code: 'not_multiple_of',
        divisor: 2,
        path: ['username'],
        message: 'Not multiple',
      },
    ],
    [
      'unrecognized_keys',
      {
        code: 'unrecognized_keys',
        keys: ['extra'],
        path: ['username'],
        message: 'Unrecognized keys',
      },
    ],
  ])(
    'maps %s issue with field label to localized invalid field message',
    async (_code, issue) => {
      mockNavigatorLanguage = 'en';
      await expect(
        getValidationErrorMessage(issue, LOGIN_CREDENTIALS_FIELD_LABELS),
      ).resolves.toBe('Invalid Username');

      mockNavigatorLanguage = 'zh-cn';
      await expect(
        getValidationErrorMessage(issue, LOGIN_CREDENTIALS_FIELD_LABELS),
      ).resolves.toBe('用户名格式无效');
    },
  );

  it('falls back to generic invalid input message when issue path has no mapped field label', async () => {
    const issue: z.core.$ZodIssue = {
      code: 'custom',
      path: [],
      message: 'Invalid',
    };

    mockNavigatorLanguage = 'en';
    await expect(
      getValidationErrorMessage(issue, LOGIN_CREDENTIALS_FIELD_LABELS),
    ).resolves.toBe('Invalid input');

    mockNavigatorLanguage = 'zh-cn';
    await expect(
      getValidationErrorMessage(issue, LOGIN_CREDENTIALS_FIELD_LABELS),
    ).resolves.toBe('输入格式无效');
  });

  async function validateSchemaAndFormat(
    schema: z.ZodType,
    input: unknown,
    fieldLabels: ValidationFieldLabels,
  ): Promise<string> {
    const parsed = schema.safeParse(input);
    expect(parsed.success).toBe(false);
    if (parsed.success) {
      throw new Error('Expected validation to fail');
    }
    return getValidationErrorMessage(parsed.error.issues[0], fieldLabels);
  }

  it.each([
    [
      'en',
      {title: '   ', content: 'Body', category: 1, isVisible: true},
      'Please enter Title',
    ],
    [
      'zh-cn',
      {title: '   ', content: 'Body', category: 1, isVisible: true},
      '请输入标题',
    ],
    [
      'en',
      {title: 'a'.repeat(256), content: 'Body', category: 1, isVisible: true},
      'Title must be at most 255 characters',
    ],
    [
      'en',
      {title: 'Hello', content: '', category: 1, isVisible: true},
      'Please enter Content',
    ],
    [
      'en',
      {title: 'Hello', content: '   \n\t ', category: 1, isVisible: true},
      'Please enter Content',
    ],
    [
      'zh-cn',
      {title: 'Hello', content: '   ', category: 1, isVisible: true},
      '请输入正文',
    ],
    [
      'en',
      {title: 'Hello', content: 'Body', category: null, isVisible: true},
      'Please select Category',
    ],
    [
      'zh-cn',
      {title: 'Hello', content: 'Body', category: null, isVisible: true},
      '请选择分类',
    ],
  ])(
    'formats ArticleDraft failure in %s for %j',
    async (language, payload, expectedMessage) => {
      mockNavigatorLanguage = language;
      await expect(
        validateSchemaAndFormat(
          ArticleDraftSchema,
          payload,
          ARTICLE_DRAFT_FIELD_LABELS,
        ),
      ).resolves.toBe(expectedMessage);
    },
  );

  it('preserves Markdown outer whitespace in ArticleDraft content and SiteOption about while rejecting whitespace-only', async () => {
    const validArticle = ArticleDraftSchema.safeParse({
      title: '  My Title  ',
      content: '  # Markdown with outer spaces  \n',
      category: 1,
      isVisible: true,
    });
    expect(validArticle.success).toBe(true);
    if (validArticle.success) {
      expect(validArticle.data.title).toBe('My Title');
      expect(validArticle.data.content).toBe(
        '  # Markdown with outer spaces  \n',
      );
    }

    const validAbout = SiteOptionSchema.safeParse({
      about: '  # About  ',
    });
    expect(validAbout.success).toBe(true);
    if (validAbout.success) {
      expect(validAbout.data.about).toBe('  # About  ');
    }

    mockNavigatorLanguage = 'en';
    await expect(
      validateSchemaAndFormat(
        SiteOptionSchema,
        {about: '   '},
        SITE_OPTION_FIELD_LABELS,
      ),
    ).resolves.toBe('Please enter About');

    mockNavigatorLanguage = 'zh-cn';
    await expect(
      validateSchemaAndFormat(
        SiteOptionSchema,
        {about: ''},
        SITE_OPTION_FIELD_LABELS,
      ),
    ).resolves.toBe('请输入关于页面内容');
  });

  it.each([
    ['en', {name: '   '}, 'Please enter Category name'],
    ['zh-cn', {name: ''}, '请输入分类名称'],
    [
      'en',
      {name: 'a'.repeat(256)},
      'Category name must be at most 255 characters',
    ],
  ])(
    'formats CategoryDraft failure in %s for %j',
    async (language, payload, expectedMessage) => {
      mockNavigatorLanguage = language;
      await expect(
        validateSchemaAndFormat(
          CategoryDraftSchema,
          payload,
          CATEGORY_DRAFT_FIELD_LABELS,
        ),
      ).resolves.toBe(expectedMessage);
    },
  );

  it('validateFormSchema returns parsed data on success and invokes localized callback on failure', async () => {
    const onValidationFailed = vi.fn();
    mockNavigatorLanguage = 'en';

    const validResult = validateFormSchema(
      CategoryDraftSchema,
      {name: '  Notes  '},
      CATEGORY_DRAFT_FIELD_LABELS,
      onValidationFailed,
    );
    expect(validResult).toEqual({name: 'Notes'});
    expect(onValidationFailed).not.toHaveBeenCalled();

    const invalidResult = validateFormSchema(
      CategoryDraftSchema,
      {name: '   '},
      CATEGORY_DRAFT_FIELD_LABELS,
      onValidationFailed,
    );
    expect(invalidResult).toBeNull();
    await vi.waitFor(() => {
      expect(onValidationFailed).toHaveBeenCalledWith(
        'Please enter Category name',
      );
    });
  });
});
