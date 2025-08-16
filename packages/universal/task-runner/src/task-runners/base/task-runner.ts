import {Task} from '@/task.js';

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

class TempTask<ResultT> extends Task<ResultT> {
  public constructor() {
    super();
  }

  public override run() {
    return null;
  }
}

/**
 * Abstract base class for executing tasks in different execution contexts.
 * Provides a unified interface for running tasks with error handling and teardown.
 */
export abstract class TaskRunner {
  /**
   * Pushes a function to be executed.
   * @param func - Function to execute that returns a result of type ResultT
   * @returns Promise resolving to the task result with success, failure, or cancellation state
   */
  public async push<ResultT>(func: () => ResultT): Promise<TaskResult<ResultT>>;
  /**
   * Pushes a task instance to be executed.
   * @param task - Task instance to execute
   * @returns Promise resolving to the task result with success, failure, or cancellation state
   */
  public async push<ResultT>(task: Task<ResultT>): Promise<TaskResult<ResultT>>;
  public async push<ResultT>(
    taskOrFunc: Task<ResultT> | (() => ResultT),
  ): Promise<TaskResult<ResultT>> {
    let task: Task<ResultT>;
    if (typeof taskOrFunc === 'function') {
      task = new TempTask<ResultT>();
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
   * For example, use `queueMicroTask()` to queue `task.run()` in the microtask queue,
   * and use Promise to wait for its execution result.
   */
  protected abstract getTaskRunPromise<ResultT>(
    task: Task<ResultT>,
  ): Promise<ReturnType<Task<ResultT>['run']>>;
}
