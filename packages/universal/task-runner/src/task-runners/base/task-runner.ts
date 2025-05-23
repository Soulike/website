import type {Task} from '@/task.js';

interface TaskSuccessResult<T> {
  error: null;
  result: T | null;
}

interface TaskFailureResult {
  error: Error;
  result: null;
}

interface TaskCancelResult {
  error: null;
  result: null;
}

type TaskResult<T> =
  | TaskSuccessResult<T>
  | TaskFailureResult
  | TaskCancelResult;

export abstract class TaskRunner {
  /**
   * Start running a task with the `TaskRunner`.
   */
  public async push<ResultT>(
    task: Task<ResultT>,
  ): Promise<TaskResult<ResultT>> {
    if (task.hasAborted()) {
      return {
        error: null,
        result: null,
      };
    }
    const taskRunPromise = this.getTaskRunPromise<ResultT>(task);

    try {
      const result = await taskRunPromise;
      return {
        error: null,
        result,
      };
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
   * Subclass implementation should wrap `task.run()` with a promise and returns it.
   * Typically, the promise is generated inside a particular type of callback.
   * For example, use `queueMicroTask()` to queue `task.run()` in the microtask queue.
   */
  protected abstract getTaskRunPromise<ResultT>(
    task: Task<ResultT>,
  ): ReturnType<Task<ResultT>['run']>;
}
