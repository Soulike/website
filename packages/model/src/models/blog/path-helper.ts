import path from 'node:path/posix';

import {prependServerPrefix} from '../path-helper.js';

export function prependBlogPrefix(subPath: string): string {
  return prependServerPrefix(path.join('/blog', subPath));
}
