import {prefix as serverPrefix} from '../utils';

export function prefix(url: string): string {
    return serverPrefix(`/account${url}`);
}
