import {queueMacroTask} from '@universal/async-helpers';

import {createTaskHandlingError} from '@/error-helpers.js';
import {Task} from '@/task.js';

import {TaskRunner} from './task-runner.js';

export class MacroTaskRunner extends TaskRunner {
  protected getTaskRunPromise<ResultT>(
    task: Task<ResultT>,
  ): Promise<ResultT | null> {
    return new Promise<ResultT | null>((resolve, reject) => {
      queueMacroTask(() => {
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
