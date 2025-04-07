import path from 'node:path';

import {prependServerPrefix} from '@models/path-helper.js';

export function prependBlogPrefix(subPath: string): string {
  return prependServerPrefix(path.join('/blog', subPath));
}
