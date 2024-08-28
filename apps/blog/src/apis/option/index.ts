import {ServerResponse} from '@website/classes';
import {Request} from '@website/request';

import {GET_ABOUT} from './ROUTE';

export async function getAbout(): Promise<ServerResponse<{about: string}>> {
  return await Request.JSONToJSON.get(GET_ABOUT);
}
