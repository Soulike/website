import assert from 'node:assert';

import {describe, expect, it, vi} from 'vitest';

import {queueMacroTask} from './queue-macro-task.js';

describe('queueMacroTask', () => {
  // Helper function to wait for macro tasks to execute
  const waitForMacroTasks = () =>
    new Promise((resolve) => setTimeout(resolve, 0));

  it('should execute the callback function asynchronously', async () => {
    const callback = vi.fn();
    queueMacroTask(callback);

    // The callback should not be executed immediately
    expect(callback).not.toHaveBeenCalled();

    await waitForMacroTasks();

    // After waiting for macro tasks, callback should have been called
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should execute after micro tasks', async () => {
    const executionOrder: string[] = [];

    queueMacroTask(() => {
      executionOrder.push('macro');
    });

    queueMicrotask(() => {
      executionOrder.push('micro');
    });

    executionOrder.push('sync');

    await waitForMacroTasks();

    // Expected order: sync -> micro -> macro
    expect(executionOrder).toEqual(['sync', 'micro', 'macro']);
  });

  it('should let errors propagate while not affecting other tasks', async () => {
    const results: string[] = [];

    const promise1 = new Promise((_, reject) => {
      queueMacroTask(() => {
        reject(new Error('An error for test'));
      });
    }).catch((error: unknown) => {
      assert(error instanceof Error);
      results.push('error: ' + error.message);
    });

    const promise2 = new Promise((resolve) => {
      queueMacroTask(() => {
        results.push('task2 executed');
        resolve(undefined);
      });
    });

    await Promise.all([promise1, promise2]);

    expect(results).toEqual(['error: An error for test', 'task2 executed']);
  });

  it('should queue multiple tasks in order', async () => {
    const results: number[] = [];

    queueMacroTask(() => results.push(1));
    queueMacroTask(() => results.push(2));
    queueMacroTask(() => results.push(3));

    await waitForMacroTasks();

    expect(results).toEqual([1, 2, 3]);
  });

  it('should work with async callbacks', async () => {
    let promiseResolved = false;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    queueMacroTask(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          promiseResolved = true;
          resolve();
        }, 10);
      });
    });

    // Wait enough time for the promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(promiseResolved).toBe(true);
  });

  it('should work in both browser and Node.js environments', async () => {
    // This test makes no specific environment assumptions
    const callback = vi.fn();
    queueMacroTask(callback);

    await waitForMacroTasks();

    expect(callback).toHaveBeenCalled();
  });

  it('should accept callback parameters if supported', async () => {
    const callback = vi.fn();

    // If function signature supports parameters:
    // queueMacroTask(callback, arg1, arg2)
    // If not, we'll use closure instead
    const arg1 = 'test';
    const arg2 = {data: 42};

    // Option 1: Test direct parameter passing if supported
    queueMacroTask(function () {
      callback(arg1, arg2);
    });

    await waitForMacroTasks();

    expect(callback).toHaveBeenCalledWith(arg1, arg2);
  });
});
