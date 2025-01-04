import path from 'node:path';

import {prefix as blogPrefix} from '../utils';

export function prefix(subPath: string): string {
  return blogPrefix(path.join('option', subPath));
}
