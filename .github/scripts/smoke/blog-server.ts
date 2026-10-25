import {requiredImageArgument, withSmokeHarness} from './shared/harness.ts';

const image = requiredImageArgument();

await withSmokeHarness(image, async (smoke) => {
  smoke.startApplication({description: 'Blog server', port: 4004});
  await smoke.waitForHttp({
    description: 'Blog server HTTP readiness',
    path: '/smoke-not-found',
    expectedStatus: 404,
  });
});

console.log(`Smoke passed for ${image}.`);
