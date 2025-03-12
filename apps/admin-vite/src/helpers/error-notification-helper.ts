import {getI18nString, STRING_KEY} from '@website/i18n';
import {ModelAccessDeniedError} from '@website/model';
import {notification} from 'antd';

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
