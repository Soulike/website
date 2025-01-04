import path from 'node:path';

import {prefix as serverPrefix} from '../utils';

export function prefix(subPath: string): string {
  return serverPrefix(path.join('blog', subPath));
}
