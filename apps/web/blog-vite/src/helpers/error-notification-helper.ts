import {ModelAccessDeniedError} from '@module/model';
import {notification} from 'antd';

import {getI18nString, STRING_KEY} from '@/i18n/index.js';

export function showErrorNotification(error: unknown) {
  console.error(error);
  if (error instanceof ModelAccessDeniedError) {
    // TODO: Use id to mark message for i18n
    notification.error({message: error.message});
  } else {
    getI18nString(STRING_KEY.UI_MESSAGE_NETWORK_ERROR)
      .then((string) => {
        notification.error({
          message: string,
        });
      })
      .catch((e: unknown) => {
        console.error(e);
      });
  }
}
