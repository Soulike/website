import type {z} from 'zod';

import {getI18nString, STRING_KEY} from '@/i18n/index.js';

export type ValidationFieldLabels = Readonly<Record<string, STRING_KEY>>;

export const LOGIN_CREDENTIALS_FIELD_LABELS: ValidationFieldLabels = {
  username: STRING_KEY.FIELD_USERNAME,
  password: STRING_KEY.FIELD_PASSWORD,
};

async function resolveFieldLabel(
  issue: z.core.$ZodIssue,
  fieldLabels: ValidationFieldLabels,
): Promise<string | undefined> {
  const field = issue.path[0];
  if (typeof field !== 'string' || !Object.hasOwn(fieldLabels, field)) {
    return undefined;
  }
  return getI18nString(fieldLabels[field]);
}

export async function getValidationErrorMessage(
  issue: z.core.$ZodIssue,
  fieldLabels: ValidationFieldLabels,
): Promise<string> {
  const fieldLabel = await resolveFieldLabel(issue, fieldLabels);
  if (fieldLabel === undefined) {
    return getI18nString(STRING_KEY.VALIDATION_INVALID_INPUT);
  }

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
      return getI18nString(
        STRING_KEY.VALIDATION_NO_OUTER_WHITESPACE,
        fieldLabel,
      );
    }
    case 'invalid_type':
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
