import path from 'node:path';

import {Request} from '@library/request';
import {type SiteOption, SiteOptionSchema} from '@schema/blog';

import {prependServerPrefix} from '../path-helper.js';
import {parseServerResponse} from '../response-helper.js';

class OptionModel {
  private static readonly PATH = Object.freeze({
    GET_ABOUT: OptionModel.prependOptionPrefix('/getAbout'),
  });

  private static prependOptionPrefix(subPath: string): string {
    return prependServerPrefix(path.join('option', subPath));
  }

  public async getAbout(): Promise<SiteOption['about']> {
    const response = await Request.JSONToJSON.get<unknown>(
      OptionModel.PATH.GET_ABOUT,
    );
    return parseServerResponse(SiteOptionSchema, response).about;
  }
}

export const optionModel = new OptionModel();
