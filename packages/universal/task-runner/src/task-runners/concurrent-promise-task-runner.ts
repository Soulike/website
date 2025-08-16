import {PromiseTask} from '@/tasks/promise-task.js';
import {TaskResult} from '@/types.js';

import {PromiseTaskRunner} from './base/promise-task-runner.js';

/**
 * A promise task runner that executes tasks immediately without queuing.
 * Currently, wraps PromiseTaskRunner for immediate execution.
 *
 * Use this when:
 * - Tasks are independent and can safely run in parallel
 * - Performance is critical, and you want maximum concurrency
 * - You have many I/O-bound tasks that don't interfere with each other
 * - Tasks don't modify shared state or have race condition concerns
 *
 * Avoid this when:
 * - Tasks depend on each other or must run in a specific order
 * - You need to limit resource usage or prevent overwhelming external services
 * - Tasks modify shared state that could cause race conditions
 * - You want predictable execution order for debugging
 *
 * @example
 * ```typescript
 * const runner = new ConcurrentPromiseTaskRunner();
 *
 * // Tasks will run immediately and concurrently
 * const promise1 = runner.push(async () => await fetchData1());
 * const promise2 = runner.push(async () => await fetchData2());
 * const promise3 = runner.push(async () => await fetchData3());
 *
 * const results = await Promise.all([promise1, promise2, promise3]);
 * ```
 */
class ConcurrentPromiseTaskRunner {
  public async push<ResultT>(
    func: () => Promise<ResultT>,
  ): Promise<TaskResult<ResultT>>;
  public async push<ResultT>(
    task: PromiseTask<ResultT>,
  ): Promise<TaskResult<ResultT>>;
  public async push<ResultT>(
    taskOrFunc: PromiseTask<ResultT> | (() => Promise<ResultT>),
  ): Promise<TaskResult<ResultT>> {
    const sequentialPromiseTaskRunner = new PromiseTaskRunner();
    if (typeof taskOrFunc === 'function') {
      return sequentialPromiseTaskRunner.push(taskOrFunc);
    } else {
      return sequentialPromiseTaskRunner.push(taskOrFunc);
    }
  }
}

export const concurrentPromiseTaskRunner = new ConcurrentPromiseTaskRunner();
