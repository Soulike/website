import {createTaskHandlingError} from '@/error-helpers.js';
import {Task} from '@/task.js';

import {TaskRunner} from './task-runner.js';

/**
 * Helper abstract class for creating task runners using async callbacks like queueMicroTask.
 */
export abstract class AsyncCallbackTaskRunner extends TaskRunner {
  /**
   * Implement the getter to provide async callback.
   */
  protected abstract get asyncCallbackFunction(): typeof queueMicrotask;

  /**
   * Do not override this unless necessary.
   */
  protected getTaskRunPromise<ResultT>(
    task: Task<ResultT>,
  ): Promise<ResultT | null> {
    return new Promise<ResultT | null>((resolve, reject) => {
      this.asyncCallbackFunction(() => {
        if (task.hasAborted()) {
          resolve(null);
        }
        task.onAbort(() => {
          resolve(null);
        });
        task
          .run()
          .then((result) => {
            if (task.hasAborted()) {
              resolve(null);
            }
            resolve(result);
          })
          .catch((error: unknown) => {
            if (task.hasAborted()) {
              return;
            }
            reject(createTaskHandlingError(error));
          });
      });
    });
  }
}
