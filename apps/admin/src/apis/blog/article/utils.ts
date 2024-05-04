import {prefix as blogPrefix} from '../utils';

export function prefix(url: string): string {
  return blogPrefix(`/article${url}`);
}
