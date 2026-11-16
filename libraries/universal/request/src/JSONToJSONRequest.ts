import {RequestOptions} from './types.js';

export type JSONRequestGetOptions = RequestOptions;

export interface JSONRequestPostOptions extends RequestOptions {
  /** Will be serialized by `JSON.stringify()`. */
  body?: unknown;
}

export class JSONToJSONRequest {
  public static async get(
    pathOrUrl: string | URL,
    options: JSONRequestGetOptions = {},
  ): Promise<unknown> {
    const {headers, searchParams} = options;
    if (searchParams) {
      if (pathOrUrl instanceof URL) {
        pathOrUrl = new URL(pathOrUrl);
        for (const [name, value] of searchParams) {
          pathOrUrl.searchParams.append(name, value);
        }
      } else {
        pathOrUrl = `${pathOrUrl}?${searchParams.toString()}`;
      }
    }

    const response = await fetch(pathOrUrl, {
      method: 'get',
      headers,
    });
    const data: unknown = await response.json();
    return data;
  }

  public static async post(
    pathOrUrl: string | URL,
    options: JSONRequestPostOptions = {},
  ): Promise<unknown> {
    const {headers, searchParams, body} = options;

    const finalHeaders = new Headers(headers);
    finalHeaders.set('Content-Type', 'application/json');

    if (searchParams) {
      if (pathOrUrl instanceof URL) {
        pathOrUrl = new URL(pathOrUrl);
        for (const [name, value] of searchParams) {
          pathOrUrl.searchParams.append(name, value);
        }
      } else {
        pathOrUrl = `${pathOrUrl}?${searchParams.toString()}`;
      }
    }

    const response = await fetch(pathOrUrl, {
      method: 'post',
      headers: finalHeaders,
      body: JSON.stringify(body),
    });
    const data: unknown = await response.json();
    return data;
  }
}
