import {type ServerResponse, type User} from '@module/classes';

import {axiosInstance} from '../CONFIG.js';
import {ADD, GET, MODIFY} from './ROUTE.js';

export async function addUser(user: User): Promise<ServerResponse<void>> {
  const {data} = await axiosInstance.post<ServerResponse<void>>(ADD, user);
  return data;
}

export async function getUser(username: string): Promise<ServerResponse<User>> {
  const {data} = await axiosInstance.get<ServerResponse<User>>(GET, {
    params: {
      json: JSON.stringify({username}),
    },
  });
  return data;
}

export async function modifyUser(user: User): Promise<ServerResponse<void>> {
  const {data} = await axiosInstance.post<ServerResponse<void>>(MODIFY, user);
  return data;
}
