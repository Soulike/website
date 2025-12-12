import path from 'node:path';

import {Request} from '@library/request';
import {ServerResponse} from '@module/classes';

import {ModelAccessDeniedError} from '../../model-access-error.js';
import {prependBlogPrefix} from './path-helper.js';

export class OptionModel {
  private static readonly PATH = Object.freeze({
    // TODO: Review the request/response data structure. Remove the object and respond string directly.
    GET_ABOUT: OptionModel.prependOptionPrefix('/getAbout'),
    SET_ABOUT: OptionModel.prependOptionPrefix('/setAbout'),
  });

  private static prependOptionPrefix(subPath: string): string {
    return prependBlogPrefix(path.join('option', subPath));
  }

  public async getAbout(): Promise<string> {
    const response = await Request.JSONToJSON.get<
      ServerResponse<{about: string}>
    >(OptionModel.PATH.GET_ABOUT);
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    } else {
      return response.data.about;
    }
  }

  public async setAbout(about: string): Promise<void> {
    const response = await Request.JSONToJSON.post<ServerResponse<void>>(
      OptionModel.PATH.SET_ABOUT,
      {
        body: {about},
      },
    );
    if (!response.isSuccessful) {
      throw new ModelAccessDeniedError(response.message);
    }
  }
}
