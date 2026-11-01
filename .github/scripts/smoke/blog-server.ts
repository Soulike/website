import {requiredImageArgument, withSmokeHarness} from './shared/harness.ts';
import {assertNodeImageRuntime} from './shared/node-runtime.ts';

const image = requiredImageArgument();
assertNodeImageRuntime(image);

await withSmokeHarness(image, async (smoke) => {
  smoke.startApplication({description: 'Blog server', port: 4004});
  await smoke.waitForHttp({
    description: 'Blog server HTTP readiness',
    path: '/smoke-not-found',
    expectedStatus: 404,
  });
});

console.log(`Smoke passed for ${image}.`);
