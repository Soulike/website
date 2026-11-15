import {ModelAccessDeniedError} from '@module/model';
import {type ServerError} from '@schema/rpc';
import {notification} from 'antd';

import {getI18nString, STRING_KEY} from '@/i18n/index.js';

export async function getServerErrorMessage(
  serverError: ServerError,
): Promise<string> {
  switch (serverError.code) {
    case 'INVALID_REQUEST_PARAMS':
      return getI18nString(STRING_KEY.SERVER_ERROR_INVALID_REQUEST_PARAMS);
    case 'INVALID_DATE':
      return getI18nString(STRING_KEY.SERVER_ERROR_INVALID_DATE);
    case 'UNAUTHORIZED':
      return getI18nString(STRING_KEY.SERVER_ERROR_UNAUTHORIZED);
    case 'ACCOUNT_NOT_FOUND':
      return getI18nString(STRING_KEY.SERVER_ERROR_ACCOUNT_NOT_FOUND);
    case 'ACCOUNT_ALREADY_EXISTS':
      return getI18nString(STRING_KEY.SERVER_ERROR_ACCOUNT_ALREADY_EXISTS);
    case 'CATEGORY_NOT_FOUND':
      return getI18nString(STRING_KEY.SERVER_ERROR_CATEGORY_NOT_FOUND);
    case 'CATEGORY_ALREADY_EXISTS':
      return getI18nString(STRING_KEY.SERVER_ERROR_CATEGORY_ALREADY_EXISTS);
    case 'CATEGORY_IN_USE':
      return getI18nString(
        STRING_KEY.SERVER_ERROR_CATEGORY_IN_USE,
        String(serverError.details.articleAmount),
      );
    case 'ARTICLE_NOT_FOUND':
      return getI18nString(STRING_KEY.SERVER_ERROR_ARTICLE_NOT_FOUND);
    case 'ARTICLE_TITLE_ALREADY_EXISTS':
      return getI18nString(
        STRING_KEY.SERVER_ERROR_ARTICLE_TITLE_ALREADY_EXISTS,
      );
    case 'ARTICLE_CATEGORY_NOT_FOUND':
      return getI18nString(STRING_KEY.SERVER_ERROR_ARTICLE_CATEGORY_NOT_FOUND);
  }
}

export function showErrorNotification(error: unknown) {
  console.error(error);
  const messagePromise =
    error instanceof ModelAccessDeniedError
      ? getServerErrorMessage(error.serverError)
      : getI18nString(STRING_KEY.UI_MESSAGE_NETWORK_ERROR);
  messagePromise
    .then((string) => {
      notification.error({
        title: string,
      });
    })
    .catch((e: unknown) => {
      console.error(e);
    });
}
