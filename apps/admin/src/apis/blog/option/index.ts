import {ServerResponse} from '@website/classes';
import {Request} from '@website/request';

import {GET_ABOUT, SET_ABOUT} from './ROUTE';

export async function getAbout(): Promise<ServerResponse<{about: string}>> {
  return Request.JSONToJSON.get(GET_ABOUT);
}

export async function setAbout(about: string): Promise<ServerResponse<void>> {
  return Request.JSONToJSON.post(SET_ABOUT, {
    body: {about},
  });
}
