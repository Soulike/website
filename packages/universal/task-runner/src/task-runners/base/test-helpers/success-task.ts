import {Task} from '@/task.js';

export class SuccessTask extends Task<number> {
  public async run() {
    await Promise.resolve();
    return 42;
  }
}
