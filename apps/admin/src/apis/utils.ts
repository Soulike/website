import {notification} from 'antd';

export function prefix(url: string): string {
  return `/server${url}`;
}

export async function showNetworkError(error: unknown) {
  console.error(error);
  return notification.error({message: '网络错误'});
}
