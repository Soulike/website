import path from 'node:path';

export function prefix(subPath: string): string {
  return path.join('/server', subPath);
}
