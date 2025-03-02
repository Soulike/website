import path from 'node:path/posix';

export function prependServerPrefix(subPath: string): string {
  return path.join('/server', subPath);
}
