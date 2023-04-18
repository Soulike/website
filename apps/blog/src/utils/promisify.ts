import {setImmediate} from 'timers';

export async function setImmediatePromise() {
    return await new Promise((resolve) => setImmediate(resolve));
}
