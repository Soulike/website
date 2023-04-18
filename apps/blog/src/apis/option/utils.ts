import {prefix} from '../utils';

export function optionPrefix(url: string): string {
    return prefix(`/option${url}`);
}
