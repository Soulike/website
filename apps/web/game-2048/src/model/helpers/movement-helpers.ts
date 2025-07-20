import type {MergeMovement, OperationMovements} from '../types.js';
import {MovementType} from '../types.js';
import {isCoordinatesEqual} from './coordinate-helpers.js';

export function combineMovements(
  operationMovements: OperationMovements,
): OperationMovements {
  const {mergeMovements, compactMovements} = operationMovements;

  // Track which compact movements have been used
  const usedCompactMovementIndexes = new Set<number>();
  const combinedMergeMovements: MergeMovement[] = [];

  // For each merge movement, check if it can be combined with a compact movement
  for (const mergeMovement of mergeMovements) {
    let combinedWithCompactMovement = false;

    for (let i = 0; i < compactMovements.length; i++) {
      const compactMovement = compactMovements[i];

      // If merge's 'to' matches compact's 'from', combine them
      if (isCoordinatesEqual(mergeMovement.to, compactMovement.from)) {
        // Create a new merge movement from merge's 'from' to compact's 'to'
        combinedMergeMovements.push({
          from: mergeMovement.from,
          to: compactMovement.to,
          type: MovementType.MERGE,
        });

        usedCompactMovementIndexes.add(i);
        combinedWithCompactMovement = true;
        break;
      }
    }

    // If no combination was found, keep the original merge movement
    if (!combinedWithCompactMovement) {
      combinedMergeMovements.push(mergeMovement);
    }
  }

  // Keep unused compact movements
  const remainingCompactMovements = compactMovements.filter(
    (_, index) => !usedCompactMovementIndexes.has(index),
  );

  return {
    mergeMovements: combinedMergeMovements,
    compactMovements: remainingCompactMovements,
  };
}
