import path from 'node:path';

import {prefix as serverPrefix} from '../../utils.js';

export function prefix(subPath: string): string {
  return serverPrefix(path.join('account', subPath));
}
