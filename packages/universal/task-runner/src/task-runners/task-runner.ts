import type {Task} from '@/task.js';

export abstract class TaskRunner {
  /**
   * Start running a task with the `TaskRunner`.
   */
  public async push<ResultT>(
    task: Task<ResultT>,
  ): ReturnType<Task<ResultT>['run']> {
    if (task.hasCanceled()) {
      return null;
    }
    const taskRunPromise = this.getTaskRunPromise<ResultT>(task);

    try {
      return await taskRunPromise;
    } catch (error: unknown) {
      if (task.handleError) {
        await task.handleError(error);
        return null;
      }
      throw error;
    } finally {
      await task.teardown?.();
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
