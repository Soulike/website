import {PromiseTask} from '@/tasks/promise-task.js';
import {TaskResult} from '@/types.js';

import {PromiseTaskRunner} from './base/promise-task-runner.js';

/**
 * A promise task runner that executes tasks sequentially in the order they were pushed.
 *
 * Use this when:
 * - Tasks depend on each other or must run in a specific order
 * - You need to limit resource usage by running one task at a time
 * - Tasks modify shared state that could cause race conditions
 * - You want predictable execution order for debugging or logging
 *
 * Avoid this when:
 * - Tasks are independent and can safely run in parallel
 * - Performance is critical and tasks can benefit from concurrent execution
 * - You have many I/O-bound tasks that don't interfere with each other
 *
 * @example
 * ```typescript
 * const runner = new SequentialPromiseTaskRunner();
 *
 * // Tasks will run in order: task1 -> task2 -> task3
 * const promise1 = runner.push(async () => await processStep1());
 * const promise2 = runner.push(async () => await processStep2());
 * const promise3 = runner.push(async () => await processStep3());
 *
 * const results = await Promise.all([promise1, promise2, promise3]);
 * ```
 */
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
