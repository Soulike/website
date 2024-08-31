import {isSSR} from '@website/utils';
import {notification} from 'antd';

export function prefix(url: string): string {
  if (isSSR()) {
    return process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/server${url}`
      : `https://soulike.tech/server${url}`;
  } else {
    return `/server${url}`;
  }
}

export function showNetworkError(error: unknown) {
  console.error(error);
  return notification.error({message: '网络错误'});
}
