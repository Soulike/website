export async function requestWrapper<ResT, DataT = ResT>(
    requestFunc: () => Promise<ResT>,
    isRequestSuccess: (response: ResT) => boolean,
    responseTransformer: (response: ResT) => DataT = (response) =>
        response as unknown as DataT,
    // side effects
    onRequestSuccess?: (response: ResT) => unknown,
    onRequestFail?: (response: ResT) => unknown,
    onRequestError?: (e: unknown) => unknown
): Promise<DataT | null> {
    try {
        const response = await requestFunc();
        if (isRequestSuccess(response)) {
            if (onRequestSuccess) await onRequestSuccess(response);
            return responseTransformer(response);
        } else {
            if (onRequestFail) await onRequestFail(response);
            return null;
        }
    } catch (e) {
        if (onRequestError) await onRequestError(e);
        return null;
    }
}
