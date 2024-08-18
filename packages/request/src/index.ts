import {
  type ServerResponseRequestErrorHandler,
  type ServerResponseRequestFailHandler,
  serverResponseRequestWrapper,
} from './serverResponseRequestWrapper';
import type {GetJsonRequestOptions, PostJsonRequestOptions} from './types';

export async function getJson<ResT>(
  path: string,
  options: GetJsonRequestOptions = {},
): Promise<ResT> {
  const {headers, searchParams} = options;

  path = searchParams ? `${path}?${searchParams.toString()}` : path;

  const response = await fetch(path, {
    method: 'get',
    headers,
  });
  return response.json();
}

export async function postJson<ResT>(
  path: string,
  options: PostJsonRequestOptions = {},
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

/**
 * @deprecated
 */
export async function getServerResponse<ResT>(
  url: string,
  options: {
    urlSearchParams?: URLSearchParams;
    headers?: Headers;
    onRequestFail?: ServerResponseRequestFailHandler;
    onRequestError?: ServerResponseRequestErrorHandler;
  } = {},
): Promise<ResT | null> {
  const {urlSearchParams, headers, onRequestFail, onRequestError} = options;
  if (urlSearchParams) {
    url = `${url}?${urlSearchParams.toString()}`;
  }
  return await serverResponseRequestWrapper<ResT>(
    async () =>
      await fetch(url, {
        method: 'GET',
        headers,
      }),
    onRequestFail,
    onRequestError,
  );
}

/**
 * @deprecated
 */
export async function postServerResponse<ResT>(
  url: string,
  body: unknown,
  options: {
    urlSearchParams?: URLSearchParams;
    headers?: Headers;
    onRequestFail?: ServerResponseRequestFailHandler;
    onRequestError?: ServerResponseRequestErrorHandler;
  } = {},
): Promise<ResT | null> {
  const {urlSearchParams, onRequestFail, onRequestError} = options;

  let {headers} = options;
  if (!headers) {
    headers = new Headers();
  }
  headers.set('Content-Type', 'application/json');

  if (urlSearchParams) {
    url = `${url}?${urlSearchParams.toString()}`;
  }

  return await serverResponseRequestWrapper<ResT>(
    async () =>
      await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      }),
    onRequestFail,
    onRequestError,
  );
}
