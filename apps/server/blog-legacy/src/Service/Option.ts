import {type SiteOption} from '@schema/blog';
import {type ServerResponse, successResponse} from '@schema/rpc';
import {promises as fs} from 'fs';
import path from 'path';

import {SERVER} from '../CONFIG/index.js';

export async function get(): Promise<ServerResponse<SiteOption>> {
  const content = await fs.readFile(
    path.join(SERVER.STATIC_POSITION, 'about.md'),
    {encoding: 'utf-8'},
  );
  return successResponse({about: content});
}
