import {isObjectEmpty} from '@library/object-helpers';

import {OrderConfig} from '../types.js';

/**
 * Generic sort function for entities in fake tables
 *
 * @template T - The entity type to sort
 * @param entities - Array of entities to sort
 * @param orderConfig - Configuration for sorting order
 * @returns Sorted array of entities
 */
export function sortEntities<T extends object>(
  entities: T[],
  orderConfig: OrderConfig<T> = {},
): T[] {
  const result = [...entities];

  if (!isObjectEmpty(orderConfig)) {
    result.sort((a, b) => {
      for (const [key, order] of Object.entries(orderConfig)) {
        const typedKey = key as keyof T;
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
