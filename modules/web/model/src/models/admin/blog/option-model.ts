import path from 'node:path';

import {Request} from '@library/request';
import {type SiteOption, SiteOptionSchema} from '@schema/blog';

import {
  parseServerResponse,
  parseVoidServerResponse,
} from '../../response-helper.js';
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

  public async getAbout(): Promise<SiteOption['about']> {
    const response = await Request.JSONToJSON.get(OptionModel.PATH.GET_ABOUT);
    return parseServerResponse(SiteOptionSchema, response).about;
  }

  public async setAbout(about: SiteOption['about']): Promise<void> {
    const response = await Request.JSONToJSON.post(OptionModel.PATH.SET_ABOUT, {
      body: {about},
    });
    parseVoidServerResponse(response);
  }
}
