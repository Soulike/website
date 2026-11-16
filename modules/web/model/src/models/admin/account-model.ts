import path from 'node:path';

import {Request} from '@library/request';
import {z} from 'zod';

import {prependServerPrefix} from '../path-helper.js';
import {
  parseServerResponse,
  parseVoidServerResponse,
} from '../response-helper.js';

const SessionCheckDataSchema = z.strictObject({
  isInSession: z.boolean(),
});

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
    const response = await Request.JSONToJSON.post(AccountModel.PATH.LOGIN, {
      body: {username, password},
    });
    parseVoidServerResponse(response);
  }

  public async logout(): Promise<void> {
    const response = await Request.JSONToJSON.post(AccountModel.PATH.LOGOUT);
    parseVoidServerResponse(response);
  }

  public async isLoggedIn(): Promise<boolean> {
    const response = await Request.JSONToJSON.get(
      AccountModel.PATH.CHECK_SESSION,
    );
    return parseServerResponse(SessionCheckDataSchema, response).isInSession;
  }
}
