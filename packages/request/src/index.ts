import {
    type ServerResponseRequestErrorHandler,
    type ServerResponseRequestFailHandler,
    serverResponseRequestWrapper,
} from './serverResponseRequestWrapper';

export async function getServerResponse<ResT>(
    url: string,
    options: {
        urlSearchParams?: URLSearchParams;
        headers?: Headers;
        onRequestFail?: ServerResponseRequestFailHandler;
        onRequestError?: ServerResponseRequestErrorHandler;
    } = {}
): Promise<ResT | null> {
    const {urlSearchParams, headers, onRequestFail, onRequestError} = options;
    if (urlSearchParams) url = `${url}?${urlSearchParams.toString()}`;
    return await serverResponseRequestWrapper<ResT>(
        async () =>
            await fetch(url, {
                method: 'GET',
                headers,
            }),
        onRequestFail,
        onRequestError
    );
}

export async function postServerResponse<ResT>(
    url: string,
    body: unknown,
    options: {
        urlSearchParams?: URLSearchParams;
        headers?: Headers;
        onRequestFail?: ServerResponseRequestFailHandler;
        onRequestError?: ServerResponseRequestErrorHandler;
    } = {}
): Promise<ResT | null> {
    const {urlSearchParams, onRequestFail, onRequestError} = options;

    let {headers} = options;
    if (!headers) headers = new Headers();
    headers.set('Content-Type', 'application/json');

    if (urlSearchParams) url = `${url}?${urlSearchParams.toString()}`;

    return await serverResponseRequestWrapper<ResT>(
        async () =>
            await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            }),
        onRequestFail,
        onRequestError
    );
}
