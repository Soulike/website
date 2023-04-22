import {requestWrapper} from './requestWrapper';
import {
    type RequestErrorHandler,
    type RequestFailHandler,
    type RequestSuccessChecker,
    type RequestSuccessHandler,
    type ResponseTransformer,
} from './types';

export async function fetchJsonWrapper<DataT>(
    requestFunc: () => Promise<Response>,
    responseTransformer: ResponseTransformer<Response, DataT> = (response) =>
        response as unknown as DataT,
    // Note: Do not consume the body of Response in following functions
    isRequestSuccess: RequestSuccessChecker<Response, DataT>,
    onRequestSuccess?: RequestSuccessHandler<Response, DataT>,
    onRequestFail?: RequestFailHandler<Response, DataT>,
    onRequestError?: RequestErrorHandler
): Promise<DataT | null> {
    return await requestWrapper<Response, DataT>(
        async () => {
            const response = await requestFunc();
            if (!response.ok)
                throw new Error(`${response.status} ${response.statusText}`);
            return response;
        },
        responseTransformer,
        isRequestSuccess,
        onRequestSuccess,
        onRequestFail,
        onRequestError
    );
}
