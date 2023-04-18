import {
    type ServerResponse,
    type SuccessfulServerResponse,
} from '@website/classes';
import {strict as assert} from 'assert';
import {type AxiosResponse} from 'axios';

import {requestWrapper} from './requestWrapper';

const isSuccessfulServerResponse = <T>(
    serverResponse: ServerResponse<T>
): serverResponse is SuccessfulServerResponse<T> => {
    return serverResponse.isSuccessful;
};

export async function appRequestWrapper<DataT>(
    requestFunc: () => Promise<AxiosResponse<ServerResponse<DataT>>>,
    warningFunc: (warningMessage: string) => unknown,
    errorFunc: (errorMessage: string) => unknown
): Promise<DataT | null> {
    return await requestWrapper(
        requestFunc,
        (response) => {
            const {data: serverResponse} = response;
            return isSuccessfulServerResponse(serverResponse);
        },
        (response) => {
            const {data: serverResponse} = response;
            return isSuccessfulServerResponse(serverResponse)
                ? serverResponse.data
                : null;
        },
        undefined,
        (response) => {
            const {data: serverResponse} = response;
            assert(!isSuccessfulServerResponse(serverResponse));
            warningFunc(serverResponse.message);
        },
        (e) => {
            errorFunc('网络异常');
            console.error(e);
        }
    );
}
