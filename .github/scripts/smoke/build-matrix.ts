import assert from 'node:assert/strict';

import {buildImageMatrix} from './shared/image-matrix.ts';

const encodedFilters = process.env.FILTER_RESULTS;
assert(
  encodedFilters !== undefined && encodedFilters.length > 0,
  'FILTER_RESULTS is required.',
);

const filters: unknown = JSON.parse(encodedFilters);
assert(
  typeof filters === 'object' && filters !== null && !Array.isArray(filters),
);

const normalizedFilters: Record<string, string | undefined> = {};
for (const [key, value] of Object.entries(filters)) {
  if (typeof value === 'string') {
    normalizedFilters[key] = value;
  }
}

process.stdout.write(JSON.stringify(buildImageMatrix(normalizedFilters)));
