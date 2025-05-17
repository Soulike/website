export abstract class Task<ResultT> {
  private isCanceled: boolean;

  /**
   * Set up the task in constructor.
   */
  protected constructor() {
    this.isCanceled = false;
  }

  /**
   * Actual task execution.
   * Implementation should Return `null` if the task is cancelled during execution.
   */
  public abstract run(): Promise<ResultT | null>;

  /**
   * Called when any error is thrown.
   */
  public abstract handleError?(error: unknown): Promise<void>;

  /**
   * Perform cleanup work if needed.
   */
  public abstract teardown?(): Promise<void>;

  /**
   * Mark the task as canceled.
   * - If `run()` is not called yet, it will not be called afterward.
   * - If `run()` is running, it is up to implementation on how to cancel work.
   * - If `run()` has returned, nothing happens.
   */
  public cancel() {
    this.isCanceled = true;
  }

  public hasCanceled() {
    return this.isCanceled;
  }
}
