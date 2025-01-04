import {notification} from 'antd';

export function showNetworkError(error: unknown) {
  console.error(error);
  notification.error({message: 'Network Error'});
}
