import {PromiseTask} from '@/tasks/promise-task.js';
import {TaskResult} from '@/types.js';

import {PromiseTaskRunner} from './base/promise-task-runner.js';

export class ConcurrentPromiseTaskRunner {
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
