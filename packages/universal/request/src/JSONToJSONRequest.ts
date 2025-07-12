import {RequestOptions} from './types.js';

export type JSONRequestGetOptions = RequestOptions;

export interface JSONRequestPostOptions extends RequestOptions {
  /** Will be serialized by `JSON.stringify()`. */
  body?: unknown;
}

export class JSONToJSONRequest {
  public static async get<ResT>(
    pathOrUrl: string | URL,
    options: JSONRequestGetOptions = {},
  ): Promise<ResT> {
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
    return response.json() as Promise<ResT>;
  }

  public static async post<ResT>(
    pathOrUrl: string | URL,
    options: JSONRequestPostOptions = {},
  ): Promise<ResT> {
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
    return response.json() as Promise<ResT>;
  }
}
