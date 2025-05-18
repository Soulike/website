import {Task} from '@/task.js';

export class AbortedErrorTask extends Task<number> {
  public async run(): Promise<number | null> {
    await Promise.resolve();
    if (this.hasAborted()) {
      throw new Error('Task was aborted but still throws');
    }
    return 42;
  }

  public async handleError(): Promise<void> {
    // Do nothing
  }
}
