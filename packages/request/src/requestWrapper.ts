import {
    type RequestErrorHandler,
    type RequestFailHandler,
    type RequestSuccessChecker,
    type RequestSuccessHandler,
    type ResponseTransformer,
} from './types';

/**
 * @returns return `null` only if the request fails to send
 */
export async function requestWrapper<ResT, DataT = ResT>(
    requestFunc: () => Promise<ResT>,
    // responseTransformer MUST NOT change the state of response
    responseTransformer: ResponseTransformer<ResT, DataT> = (response) =>
        response as unknown as DataT,
    isRequestSuccess: RequestSuccessChecker<ResT, DataT>,
    onRequestSuccess?: RequestSuccessHandler<ResT, DataT>,
    onRequestFail?: RequestFailHandler<ResT, DataT>,
    onRequestError?: RequestErrorHandler
): Promise<DataT | null> {
    try {
        const response = await requestFunc();
        const data = await responseTransformer(response);

        if (await isRequestSuccess(response, data)) {
            if (onRequestSuccess) await onRequestSuccess(response, data);
        } else if (onRequestFail) {
            await onRequestFail(response, data);
        }
        return data;
    } catch (e) {
        if (onRequestError) await onRequestError(e);
        return null;
    }
}
