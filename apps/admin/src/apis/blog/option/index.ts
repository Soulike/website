import * as request from '@website/request';
import {message} from 'antd';

import {GET_ABOUT, SET_ABOUT} from './ROUTE';

export async function get(): Promise<{about: string} | null> {
  return await request.getServerResponse(GET_ABOUT, {
    onRequestFail: (msg) => message.warning(msg),
    onRequestError: (msg) => message.error(msg),
  });
}

export async function set(about: string): Promise<true | null> {
  return await request.postServerResponse(
    SET_ABOUT,
    {about},
    {
      onRequestFail: (msg) => message.warning(msg),
      onRequestError: (msg) => message.error(msg),
    },
  );
}
