import {prefix} from '../utils';

export function articlePrefix(url: string): string {
    return prefix(`/article${url}`);
}
