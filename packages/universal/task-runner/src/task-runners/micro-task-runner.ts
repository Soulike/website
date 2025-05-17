import {createTaskHandlingError} from '@/error-helpers.js';
import {Task} from '@/task.js';

import {TaskRunner} from './task-runner.js';

export class MicroTaskRunner extends TaskRunner {
  protected getTaskRunPromise<ResultT>(
    task: Task<ResultT>,
  ): Promise<ResultT | null> {
    return new Promise<ResultT | null>((resolve, reject) => {
      queueMicrotask(() => {
        if (task.hasCanceled()) {
          resolve(null);
        }
        task
          .run()
          .then((result) => {
            resolve(result);
          })
          .catch((error: unknown) => {
            reject(createTaskHandlingError(error));
          });
      });
    });
  }
}
