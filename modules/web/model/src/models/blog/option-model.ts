import path from 'node:path';

import {Request} from '@library/request';
import {ServerResponse} from '@module/classes';

import {ModelAccessDeniedError} from '../model-access-error.js';
import {prependServerPrefix} from '../path-helper.js';

class OptionModel {
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

export const optionModel = new OptionModel();
