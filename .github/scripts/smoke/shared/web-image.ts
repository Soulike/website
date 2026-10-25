import assert from 'node:assert/strict';

import {withSmokeHarness} from './harness.ts';

export async function smokeWebImage(
  image: string,
  upstreamHosts: readonly string[],
): Promise<void> {
  await withSmokeHarness(image, async (smoke) => {
    smoke.startApplication({
      description: 'Web image',
      port: 3000,
      dockerArgs: upstreamHosts.flatMap((host) => [
        '--add-host',
        `${host}:127.0.0.1`,
      ]),
    });

    const response = await smoke.waitForHttp({
      description: 'Web image HTTP readiness',
      path: '/',
      expectedStatus: 200,
    });
    assert.match(response.body, /<!doctype html|<html/i);
  });

  console.log(`Smoke passed for ${image}.`);
}
