import {PromiseTask} from '@/tasks/promise-task.js';
import {TaskResult} from '@/types.js';

class TempPromiseTask<ResultT> extends PromiseTask<ResultT> {
  public constructor() {
    super();
  }

  public run(): Promise<ResultT | null> {
    return Promise.resolve(null);
  }
}

export class PromiseTaskRunner {
  public async push<ResultT>(
    func: () => Promise<ResultT>,
  ): Promise<TaskResult<ResultT>>;
  public async push<ResultT>(
    task: PromiseTask<ResultT>,
  ): Promise<TaskResult<ResultT>>;
  public async push<ResultT>(
    taskOrFunc: PromiseTask<ResultT> | (() => Promise<ResultT>),
  ): Promise<TaskResult<ResultT>> {
    let task: PromiseTask<ResultT> | null = null;
    if (typeof taskOrFunc === 'function') {
      task = new TempPromiseTask<ResultT>();
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

    try {
      const result = await task.run();
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
}
