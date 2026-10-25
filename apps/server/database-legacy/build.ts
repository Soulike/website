import {buildServer} from '@config/esbuild/server';

await buildServer(['./src/index.ts']);
