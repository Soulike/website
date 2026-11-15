import {isObjectEmpty} from '@library/object-helpers';

import {OrderConfig} from '../types.js';

export function createEntityKeyMap<T extends object>(
  keys: readonly (keyof T)[],
): ReadonlyMap<string, keyof T> {
  return new Map(keys.map((key) => [String(key), key]));
}

/**
 * Generic sort function for entities in fake tables
 *
 * @template T - The entity type to sort
 * @param entities - Array of entities to sort
 * @param orderConfig - Configuration for sorting order
 * @param keys - Known entity keys used to resolve sort keys without unsafe assertions
 * @returns Sorted array of entities
 */
export function sortEntities<T extends object>(
  entities: T[],
  orderConfig: OrderConfig<T> = {},
  keys: readonly (keyof T)[],
): T[] {
  const result = [...entities];
  const keyMap = createEntityKeyMap(keys);

  if (!isObjectEmpty(orderConfig)) {
    result.sort((a, b) => {
      for (const [key, order] of Object.entries(orderConfig)) {
        const typedKey = keyMap.get(key);
        if (typedKey === undefined || order === undefined) {
          continue;
        }
        const valueA = a[typedKey];
        const valueB = b[typedKey];

        if (valueA < valueB) {
          return order === 'ASC' ? -1 : 1;
        }
        if (valueA > valueB) {
          return order === 'ASC' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  return result;
}
