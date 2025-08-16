import {PromiseTask} from '@/tasks/promise-task.js';
import {TaskResult} from '@/types.js';

import {PromiseTaskRunner} from './base/promise-task-runner.js';

export class SequentialPromiseTaskRunner {
  private taskQueue: (() => Promise<void>)[] = [];
  private isRunning = false;

  public async push<ResultT>(
    func: () => Promise<ResultT>,
  ): Promise<TaskResult<ResultT>>;
  public async push<ResultT>(
    task: PromiseTask<ResultT>,
  ): Promise<TaskResult<ResultT>>;
  public async push<ResultT>(
    taskOrFunc: PromiseTask<ResultT> | (() => Promise<ResultT>),
  ): Promise<TaskResult<ResultT>> {
    return new Promise<TaskResult<ResultT>>((resolve) => {
      this.taskQueue.push(async () => {
        const promiseTaskRunner = new PromiseTaskRunner();
        const result =
          typeof taskOrFunc === 'function'
            ? await promiseTaskRunner.push(taskOrFunc)
            : await promiseTaskRunner.push(taskOrFunc);
        resolve(result);
      });

      void this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isRunning || this.taskQueue.length === 0) {
      return;
    }

    this.isRunning = true;

    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (task) {
        await task();
      }
    }

    this.isRunning = false;
  }
}

export const sequentialPromiseTaskRunner = new SequentialPromiseTaskRunner();
