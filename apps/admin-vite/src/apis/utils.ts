import path from 'node:path';

import {notification} from 'antd';

export function prefix(subPath: string): string {
  return path.join('/server', subPath);
}

export function showNetworkError(error: unknown) {
  console.error(error);
  notification.error({message: 'Network Error'});
}
