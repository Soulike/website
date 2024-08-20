import {RequestOptions} from './types';

export type JSONRequestGetOptions = RequestOptions;
export interface JSONRequestPostOptions extends RequestOptions {
  /** Will be serialized by `JSON.stringify()`. */
  body?: unknown;
}

export class JSONToJSONRequest {
  public static async get<ResT>(
    path: string,
    options: JSONRequestGetOptions = {},
  ): Promise<ResT> {
    const {headers, searchParams} = options;

    path = searchParams ? `${path}?${searchParams.toString()}` : path;

    const response = await fetch(path, {
      method: 'get',
      headers,
    });
    return response.json();
  }

  public static async post<ResT>(
    path: string,
    options: JSONRequestPostOptions = {},
  ): Promise<ResT> {
    const {headers, searchParams, body} = options;

    const finalHeaders = new Headers(headers);
    finalHeaders.set('Content-Type', 'application/json');

    path = searchParams ? `${path}?${searchParams.toString()}` : path;

    const response = await fetch(path, {
      method: 'post',
      headers: finalHeaders,
      body: JSON.stringify(body),
    });
    return response.json();
  }
}
