import path from 'node:path';

import {ModelAccessDeniedError} from '@models/model-access-error.js';
import {prependServerPrefix} from '@models/path-helper.js';
import {ServerResponse} from '@website/classes';
import {Request} from '@website/request';

export class OptionModel {
  private static readonly PATH = Object.freeze({
    GET_ABOUT: OptionModel.prependOptionPrefix('/getAbout'),
  });

  private static prependOptionPrefix(subPath: string): string {
    return prependServerPrefix(path.join('option', subPath));
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
}
