import type {MergeMovement, OperationMovements} from '../types.js';
import {MovementType} from '../types.js';
import {isCoordinatesEqual} from './coordinate-helpers.js';

/**
 * Combines merge and compact movements.
 *
 * When a merge movement's destination coordinates match a compact movement's source
 * coordinates, they are combined into a single optimized merge movement. This prevents
 * tiles from briefly appearing at intermediate positions during animations.
 *
 * @example
 * ```typescript
 * const movements = {
 *   mergeMovements: [{ from: {x: 0, y: 0}, to: {x: 1, y: 0}, type: 'merge', scoreChange: 4 }],
 *   compactMovements: [{ from: {x: 1, y: 0}, to: {x: 2, y: 0}, type: 'compact' }]
 * };
 * const combined = combineMovements(movements);
 * // Result: merge movement directly from {x: 0, y: 0} to {x: 2, y: 0}
 * ```
 */
export function combineMovements(
  operationMovements: OperationMovements,
): OperationMovements {
  const {mergeMovements, compactMovements} = operationMovements;

  const combinedMergeMovements: MergeMovement[] = [];

  // For each merge movement, check if it can be combined with a compact movement
  for (const mergeMovement of mergeMovements) {
    let combinedWithCompactMovement = false;

    for (const compactMovement of compactMovements) {
      // If merge's 'to' matches compact's 'from', combine them
      if (isCoordinatesEqual(mergeMovement.to, compactMovement.from)) {
        // Create a new merge movement from merge's 'from' to compact's 'to'
        combinedMergeMovements.push({
          from: mergeMovement.from,
          to: compactMovement.to,
          type: MovementType.MERGE,
          scoreChange: mergeMovement.scoreChange,
        });

        combinedWithCompactMovement = true;
        break;
      }
    }

    // If no combination was found, keep the original merge movement
    if (!combinedWithCompactMovement) {
      combinedMergeMovements.push(mergeMovement);
    }
  }

  return {
    mergeMovements: combinedMergeMovements,
    compactMovements,
  };
}
