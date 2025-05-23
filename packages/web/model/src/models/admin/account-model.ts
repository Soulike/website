import path from 'node:path';

import {ModelAccessDeniedError} from '@models/model-access-error.js';
import {prependServerPrefix} from '@models/path-helper.js';
import {ServerResponse} from '@website/classes';
import {Request} from '@website/request';

export class AccountModel {
  private static readonly PATH = Object.freeze({
    LOGIN: AccountModel.prependAccountPrefix('/login'),
    LOGOUT: AccountModel.prependAccountPrefix('/logout'),
    CHECK_SESSION: AccountModel.prependAccountPrefix('/checkSession'),
  });

  private static prependAccountPrefix(subPath: string): string {
    return prependServerPrefix(path.join('account', subPath));
  }

  public async login(username: string, password: string): Promise<void> {
    const response = await Request.JSONToJSON.post<ServerResponse<void>>(
      AccountModel.PATH.LOGIN,
      {
        body: {username, password},
      },
    );

    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    }
  }

  public async logout(): Promise<void> {
    const response = await Request.JSONToJSON.post<ServerResponse<void>>(
      AccountModel.PATH.LOGOUT,
    );

    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    }
  }

  public async isLoggedIn(): Promise<boolean> {
    const response = await Request.JSONToJSON.get<
      ServerResponse<{isInSession: boolean}>
    >(AccountModel.PATH.CHECK_SESSION);

    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    } else {
      return response.data.isInSession;
    }
  }
}
