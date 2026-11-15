import {LoginCredentialsSchema} from '@schema/auth';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {z} from 'zod';

import {
  getValidationErrorMessage,
  LOGIN_CREDENTIALS_FIELD_LABELS,
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
});
