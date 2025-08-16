import {Task} from '@/tasks/task.js';

/**
 * Abstract task class for asynchronous operations that return promises.
 * Extends the base Task class to handle promise-based execution patterns.
 *
 * @template ResultT - The type of result the promise resolves to
 */
export abstract class PromiseTask<ResultT> extends Task<
  Promise<ResultT | null>
> {
  /**
   * Executes the asynchronous task operation.
   *
   * @returns Promise that resolves to the task result, or null if the operation fails/is cancelled
   */
  public abstract run(): Promise<ResultT | null>;
}
