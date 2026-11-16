import type {z} from 'zod';

import {getI18nString, STRING_KEY} from '@/i18n/index.js';

export type ValidationFieldLabels = Readonly<Record<string, STRING_KEY>>;

export const LOGIN_CREDENTIALS_FIELD_LABELS: ValidationFieldLabels = {
  username: STRING_KEY.FIELD_USERNAME,
  password: STRING_KEY.FIELD_PASSWORD,
};

export const ARTICLE_DRAFT_FIELD_LABELS: ValidationFieldLabels = {
  title: STRING_KEY.FIELD_ARTICLE_TITLE,
  content: STRING_KEY.FIELD_ARTICLE_CONTENT,
  category: STRING_KEY.FIELD_ARTICLE_CATEGORY,
  isVisible: STRING_KEY.FIELD_ARTICLE_VISIBILITY,
};

export const CATEGORY_DRAFT_FIELD_LABELS: ValidationFieldLabels = {
  name: STRING_KEY.FIELD_CATEGORY_NAME,
};

export const SITE_OPTION_FIELD_LABELS: ValidationFieldLabels = {
  about: STRING_KEY.FIELD_ABOUT,
};

function resolveFieldKey(
  issue: z.core.$ZodIssue,
  fieldLabels: ValidationFieldLabels,
): {field: string; labelKey: STRING_KEY} | undefined {
  const field = issue.path[0];
  if (typeof field !== 'string' || !Object.hasOwn(fieldLabels, field)) {
    return undefined;
  }
  const labelKey = fieldLabels[field];
  if (labelKey === undefined) {
    return undefined;
  }
  return {field, labelKey};
}

export async function getValidationErrorMessage(
  issue: z.core.$ZodIssue,
  fieldLabels: ValidationFieldLabels,
): Promise<string> {
  const resolved = resolveFieldKey(issue, fieldLabels);
  if (resolved === undefined) {
    return getI18nString(STRING_KEY.VALIDATION_INVALID_INPUT);
  }
  const fieldLabel = await getI18nString(resolved.labelKey);

  switch (issue.code) {
    case 'too_small': {
      if (issue.origin === 'string' && issue.minimum === 1) {
        return getI18nString(STRING_KEY.VALIDATION_REQUIRED, fieldLabel);
      }
      return getI18nString(
        STRING_KEY.VALIDATION_TOO_SMALL,
        fieldLabel,
        String(issue.minimum),
      );
    }
    case 'too_big': {
      return getI18nString(
        STRING_KEY.VALIDATION_TOO_BIG,
        fieldLabel,
        String(issue.maximum),
      );
    }
    case 'custom': {
      if (resolved.field === 'username') {
        return getI18nString(
          STRING_KEY.VALIDATION_NO_OUTER_WHITESPACE,
          fieldLabel,
        );
      }
      if (resolved.field === 'content' || resolved.field === 'about') {
        return getI18nString(STRING_KEY.VALIDATION_REQUIRED, fieldLabel);
      }
      return getI18nString(STRING_KEY.VALIDATION_INVALID_FIELD, fieldLabel);
    }
    case 'invalid_type': {
      if (
        resolved.field === 'category' &&
        (issue.input === null || issue.input === undefined)
      ) {
        return getI18nString(STRING_KEY.VALIDATION_SELECT_REQUIRED, fieldLabel);
      }
      return getI18nString(STRING_KEY.VALIDATION_INVALID_FIELD, fieldLabel);
    }
    case 'invalid_format':
    case 'invalid_value':
    case 'invalid_union':
    case 'invalid_key':
    case 'invalid_element':
    case 'not_multiple_of':
    case 'unrecognized_keys': {
      return getI18nString(STRING_KEY.VALIDATION_INVALID_FIELD, fieldLabel);
    }
  }
}

export function validateFormSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
  fieldLabels: ValidationFieldLabels,
  onValidationFailed: (message: string) => void,
): z.infer<TSchema> | null {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const [firstIssue] = parsed.error.issues;
    if (firstIssue === undefined) {
      return null;
    }
    getValidationErrorMessage(firstIssue, fieldLabels)
      .then((message) => {
        onValidationFailed(message);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
    return null;
  }
  return parsed.data;
}
