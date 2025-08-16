import {createTaskHandlingError} from '@/error-helpers.js';
import {SyncTask} from '@/tasks/sync-task.js';
import {TaskResult} from '@/types.js';

class TempSyncTask<ResultT> extends SyncTask<ResultT> {
  public constructor() {
    super();
  }

  public run(): ResultT | null {
    return null;
  }
}

/**
 * Abstract class for task runners that execute tasks using async callback functions.
 * Extends TaskRunner to provide a framework for implementing task execution in different
 * async contexts (e.g., microtasks, timeouts, message channels).
 */
export abstract class SyncTaskRunner {
  /**
   * Returns the async callback function to use for task scheduling.
   * Implementations should return functions like queueMicrotask, setTimeout, etc.
   * @returns The async callback function for scheduling task execution
   */
  protected abstract get queueFunction(): typeof queueMicrotask;

  /**
   * Pushes a function to be executed.
   * @param func - Function to execute that returns a result of type ResultT
   * @returns Promise resolving to the task result with success, failure, or cancellation state
   */
  public async push<ResultT>(func: () => ResultT): Promise<TaskResult<ResultT>>;
  /**
   * Pushes a task instance to be executed.
   * @param task - Task instance to execute
   * @returns Promise resolving to the task result with success, failure, or cancellation state
   */
  public async push<ResultT>(
    task: SyncTask<ResultT>,
  ): Promise<TaskResult<ResultT>>;
  public async push<ResultT>(
    taskOrFunc: SyncTask<ResultT> | (() => ResultT),
  ): Promise<TaskResult<ResultT>> {
    let task: SyncTask<ResultT> | null = null;
    if (typeof taskOrFunc === 'function') {
      task = new TempSyncTask<ResultT>();
      task.run = taskOrFunc;
    } else {
      task = taskOrFunc;
    }

    if (task.hasAborted()) {
      return {
        error: null,
        result: null,
      };
    }
    const taskRunPromise = this.getTaskRunPromise<ResultT>(task);

    try {
      const result = await taskRunPromise;
      if (result) {
        return {
          error: null,
          result,
        };
      } else {
        // Cancelled during execution.
        return {
          error: null,
          result: null,
        };
      }
    } catch (error: unknown) {
      const outputError = new Error(`Error during task execution.`);
      outputError.cause = error;
      return {
        error: outputError,
        result: null,
      };
    } finally {
      await task.teardown();
    }
  }

  /**
   * Creates a promise that wraps task execution in the async callback context.
   * Handles task abortion before and during execution.
   * Override only if custom promise handling is needed.
   *
   * @param task - The task to execute
   * @returns Promise that resolves with the task result or null if aborted
   */
  private getTaskRunPromise<ResultT>(task: SyncTask<ResultT>) {
    return new Promise<ResultT | null>((resolve, reject) => {
      this.queueFunction(() => {
        if (task.hasAborted()) {
          // Abort before run.
          resolve(null);
          return;
        }
        task.onAbort(() => {
          // Abort during run.
          resolve(null);
        });
        try {
          const result = task.run();
          if (task.hasAborted()) {
            resolve(null);
            return;
          }
          resolve(result);
        } catch (e: unknown) {
          if (task.hasAborted()) {
            return;
          }
          reject(createTaskHandlingError(e));
        }
      });
    });
  }
}
