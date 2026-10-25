import assert from 'node:assert/strict';
import test from 'node:test';

import {buildImageMatrix} from './image-matrix.ts';

test('selects every image for a shared change', () => {
  const matrix = buildImageMatrix({shared: 'true'});

  assert.equal(matrix.length, 7);
  assert.equal(
    new Set(matrix.map((entry) => entry['docker-build-target'])).size,
    7,
  );
});

test('selects only directly affected images', () => {
  const matrix = buildImageMatrix({
    shared: 'false',
    blog: 'true',
    'auth-server': 'true',
  });

  assert.deepEqual(
    matrix.map((entry) => entry['docker-build-target']),
    ['blog', 'auth-server'],
  );
});

test('returns an empty matrix when no application changed', () => {
  assert.deepEqual(buildImageMatrix({shared: 'false'}), []);
});
