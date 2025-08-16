import {createTaskHandlingError} from '@/error-helpers.js';
import {Task} from '@/task.js';

import {TaskRunner} from './task-runner.js';

/**
 * Abstract class for task runners that execute tasks using async callback functions.
 * Extends TaskRunner to provide a framework for implementing task execution in different
 * async contexts (e.g., microtasks, timeouts, message channels).
 */
export abstract class AsyncCallbackTaskRunner extends TaskRunner {
  /**
   * Returns the async callback function to use for task scheduling.
   * Implementations should return functions like queueMicrotask, setTimeout, etc.
   * @returns The async callback function for scheduling task execution
   */
  protected abstract get asyncCallbackFunction(): typeof queueMicrotask;

  /**
   * Creates a promise that wraps task execution in the async callback context.
   * Handles task abortion before and during execution.
   * Override only if custom promise handling is needed.
   *
   * @param task - The task to execute
   * @returns Promise that resolves with the task result or null if aborted
   */
  protected getTaskRunPromise<ResultT>(task: Task<ResultT>) {
    return new Promise<ResultT | null>((resolve, reject) => {
      this.asyncCallbackFunction(() => {
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
