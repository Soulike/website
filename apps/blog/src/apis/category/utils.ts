import {prefix} from '../utils';

export function categoryPrefix(url: string): string {
    return prefix(`/category${url}`);
}
