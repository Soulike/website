export abstract class Task<RunResultT> {
  private abortController: AbortController;
  private abortEventListeners: EventListener[];

  /**
   * Set up the task in constructor.
   */
  protected constructor() {
    this.abortController = new AbortController();
    this.abortEventListeners = [];
  }

  /**
   * `AbortSignal` used for some APIs, like `fetch()`.
   * Use `onAbort` if you want register listeners for `abort` event.
   */
  protected get signal() {
    return this.abortController.signal;
  }

  public abstract run(): RunResultT;

  /**
   * Perform cleanup work.
   * Subclass should always call `super.teardown()`.
   */
  public teardown(): Promise<void> | void {
    for (const eventListener of this.abortEventListeners) {
      this.abortController.signal.removeEventListener('abort', eventListener);
    }
    this.abortEventListeners = [];
  }

  /**
   * Abort the current task.
   * If the task is running, the abortion behavior depends on `run()` implementation.
   * If the task has not started, it should not be executed.
   * If the task has completed, nothing happens.
   */
  public abort() {
    this.abortController.abort();
  }

  public hasAborted() {
    return this.abortController.signal.aborted;
  }

  /**
   * Register listener for abort event. Task can use the event to abort pending works.
   * Note that all listeners are unregistered in `teardown()`. Always register before task is run.
   * @param eventListener
   */
  public onAbort(eventListener: EventListener) {
    this.abortEventListeners.push(eventListener);
    this.abortController.signal.addEventListener('abort', eventListener);
  }
}
