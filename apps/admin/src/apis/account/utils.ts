import {prefix as serverPrefix} from '@/apis/utils';

export function prefix(url: string): string {
  return serverPrefix(`/account${url}`);
}
