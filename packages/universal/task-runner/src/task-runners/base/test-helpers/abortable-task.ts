import {Task} from '@/task.js';

export class AbortableTask extends Task<number> {
  public async run() {
    return new Promise<number | null>((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(42);
      }, 1000);

      this.onAbort(() => {
        clearTimeout(timeoutId);
        resolve(null);
      });
    });
  }
}
