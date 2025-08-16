import {Task} from './task.js';

/**
 * Abstract task class for synchronous operations that execute immediately.
 * Extends the base Task class to handle blocking, synchronous execution patterns.
 *
 * Use this for operations that:
 * - Complete immediately without async operations
 * - Don't require waiting for external resources
 * - Perform CPU-bound calculations or data transformations
 * - Need to block execution until completion
 *
 * @template ResultT - The type of result the synchronous operation returns
 *
 * @example
 * ```typescript
 * class CalculationTask extends SyncTask<number> {
 *   constructor(private a: number, private b: number) {
 *     super();
 *   }
 *
 *   public run(): number {
 *     return this.a + this.b;
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export abstract class SyncTask<ResultT> extends Task<ResultT | null> {
  /**
   * Executes the synchronous task operation immediately.
   *
   * @returns The task result, or null if the operation fails/is cancelled
   */
  public abstract run(): ResultT | null;
}
