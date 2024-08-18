export interface RequestOptions {
  headers?: Headers;
  searchParams?: URLSearchParams;
}

export type GetJsonRequestOptions = RequestOptions;

export interface PostJsonRequestOptions extends RequestOptions {
  /** Will be serialized by `JSON.stringify()`. */
  body?: unknown;
}

export type RequestSuccessChecker<ResT, DataT> = (
  response: ResT,
  data: DataT,
) => boolean | Promise<boolean>;

export type ResponseTransformer<ResT, DataT> = (
  response: ResT,
) => DataT | Promise<DataT>;

type RequestResultHandler<ResT, DataT> = (
  response: ResT,
  data: DataT,
) => unknown | Promise<unknown>;
export type RequestSuccessHandler<ResT, DataT> = RequestResultHandler<
  ResT,
  DataT
>;
export type RequestFailHandler<ResT, DataT> = RequestResultHandler<ResT, DataT>;

export type RequestErrorHandler = (e: unknown) => unknown | Promise<unknown>;
