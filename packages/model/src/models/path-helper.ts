import path from 'node:path';

export function prependServerPrefix(subPath: string): string {
  return path.join('/server', subPath);
}
