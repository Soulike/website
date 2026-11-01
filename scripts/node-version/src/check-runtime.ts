import {assertNodeRuntime} from './runtime.ts';

assertNodeRuntime();
console.log(`Node runtime verified: ${process.versions.node}`);
