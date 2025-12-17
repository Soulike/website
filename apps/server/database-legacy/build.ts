import {buildServer, createServerBuildConfig} from '@config/bun/server';

const config = createServerBuildConfig(['./src/index.ts']);
await buildServer(config);
