import path from 'node:path';

import {prefix as blogPrefix} from '../utils.js';

export function prefix(subPath: string): string {
  return blogPrefix(path.join('article', subPath));
}
