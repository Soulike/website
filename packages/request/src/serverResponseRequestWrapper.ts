import {strict as assert} from 'assert';

import {type ServerResponse} from '../../classes/dist';
import {fetchJsonWrapper} from './fetchJsonWrapper';

export type ServerResponseRequestFailHandler = (
    message: string
) => unknown | Promise<unknown>;
export type ServerResponseRequestErrorHandler = (
    message: string,
    error: unknown
) => unknown | Promise<unknown>;

export async function serverResponseRequestWrapper<DataT>(
    requestFunc: () => Promise<Response>,
    onRequestFail?: ServerResponseRequestFailHandler,
    onRequestError?: ServerResponseRequestErrorHandler
): Promise<DataT | null> {
    const noData = Symbol('no data in responseData');
    let responseData: symbol | ServerResponse<DataT> = noData;

    const serverResponse = await fetchJsonWrapper<ServerResponse<DataT>>(
        requestFunc,
        async (response) => {
            if (responseData === noData) responseData = await response.json();
            assert(typeof responseData !== 'symbol');
            return responseData;
        },
        (_, serverResponse) => serverResponse.isSuccessful,
        undefined,
        async (_, serverResponse) => {
            assert(!serverResponse.isSuccessful);
            if (onRequestFail) await onRequestFail(serverResponse.message);
        },
        (e) => {
            console.error(e);
            if (onRequestError) onRequestError('网络错误', e);
        }
    );

    if (serverResponse !== null) {
        if (serverResponse.isSuccessful) return serverResponse.data;
        else return null;
    } else return null;
}
