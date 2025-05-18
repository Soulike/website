import {Task} from '@/task.js';

export class ErrorTask extends Task<null> {
  public async run(): Promise<null> {
    await Promise.resolve();
    throw new Error('Task intentionally failed');
  }

  handleError(): Promise<void> {
    return Promise.resolve();
  }
}
