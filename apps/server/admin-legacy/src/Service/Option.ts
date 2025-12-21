import {type ServerResponse, SuccessfulServerResponse} from '@module/classes';
import {promises as fs} from 'fs';
import path from 'path';

import {SERVER} from '../CONFIG/index.js';

export async function get(): Promise<ServerResponse<{about: string}>> {
  const content = await fs.readFile(
    path.join(SERVER.STATIC_POSITION, 'about.md'),
    {encoding: 'utf-8'},
  );
  return new SuccessfulServerResponse({about: content});
}

export async function set(about: string): Promise<ServerResponse<void>> {
  await fs.mkdir(SERVER.STATIC_POSITION, {recursive: true});
  await fs.writeFile(path.join(SERVER.STATIC_POSITION, 'about.md'), about, {
    encoding: 'utf-8',
  });
  return new SuccessfulServerResponse(undefined);
}
