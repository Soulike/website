import {queueMacroTask} from '@universal/async-helpers';

export async function waitForMacroTask() {
  return new Promise<void>((resolve) => {
    queueMicrotask(() => {
      // Ensure we're after micro tasks
      queueMicrotask(() => {
        // Double queueMicrotask to ensure we're after all microtasks
        queueMacroTask(() => {
          resolve();
        });
      });
    });
  });
}
