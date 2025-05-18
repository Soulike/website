import {describe, expect, test, vi} from 'vitest';

import {Task} from '@/task.js';

import {AbortableTask} from './test-helpers/abortable-task.js';
import {AbortedErrorTask} from './test-helpers/aborted-error-task.js';
import {ErrorTask} from './test-helpers/error-task.js';
import {SuccessTask} from './test-helpers/success-task.js';
import {testMicroTaskRunner} from './test-helpers/test-micro-task-runner.js';
import {waitForMicroTask} from './test-helpers/wait-for-micro-task.js';

describe('AsyncCallbackTaskRunner', () => {
  test('should execute task and return result', async () => {
    const task = new SuccessTask();
    const resultPromise = testMicroTaskRunner.push(task);

    await waitForMicroTask();
    const result = await resultPromise;

    expect(result).toBe(42);
  });

  test('should handle task error and return null', async () => {
    const task = new ErrorTask();
    const handleErrorSpy = vi.spyOn(task, 'handleError');
    const resultPromise = testMicroTaskRunner.push(task);

    await waitForMicroTask();
    const result = await resultPromise;

    expect(result).toBeNull();
    expect(handleErrorSpy).toHaveBeenCalledTimes(1);
  });

  test('should return null for aborted task', async () => {
    const task = new AbortableTask();
    const resultPromise = testMicroTaskRunner.push(task);
    task.abort();

    await waitForMicroTask();
    const result = await resultPromise;

    expect(result).toBeNull();
  });

  test('should execute multiple tasks in order', async () => {
    const executionOrder: number[] = [];

    class OrderedTask extends Task<void> {
      constructor(private readonly order: number) {
        super();
      }

      public async run() {
        await Promise.resolve();
        executionOrder.push(this.order);
        return undefined;
      }
    }

    const taskPromises = [
      testMicroTaskRunner.push(new OrderedTask(1)),
      testMicroTaskRunner.push(new OrderedTask(2)),
      testMicroTaskRunner.push(new OrderedTask(3)),
    ];

    await waitForMicroTask();
    await Promise.all(taskPromises);

    expect(executionOrder).toEqual([1, 2, 3]);
  });

  test('should not execute task if aborted before push', async () => {
    const task = new SuccessTask();
    const runSpy = vi.spyOn(task, 'run');
    task.abort();

    const resultPromise = testMicroTaskRunner.push(task);
    await waitForMicroTask();
    const result = await resultPromise;

    expect(result).toBeNull();
    expect(runSpy).not.toHaveBeenCalled();
  });

  test('should abort task during execution', async () => {
    const task = new AbortableTask();
    const resultPromise = testMicroTaskRunner.push(task);

    // Wait for task to start executing
    await waitForMicroTask();
    // Abort while task is running
    task.abort();

    const result = await resultPromise;
    expect(result).toBeNull();
  });

  test('should call teardown after task completion', async () => {
    const task = new SuccessTask();
    const teardownSpy = vi.spyOn(task, 'teardown');

    const resultPromise = testMicroTaskRunner.push(task);
    await waitForMicroTask();
    await resultPromise;

    expect(teardownSpy).toHaveBeenCalledTimes(1);
  });

  test('should call teardown after task error', async () => {
    const task = new ErrorTask();
    const teardownSpy = vi.spyOn(task, 'teardown');

    const resultPromise = testMicroTaskRunner.push(task);
    await waitForMicroTask();
    await resultPromise;

    expect(teardownSpy).toHaveBeenCalledTimes(1);
  });

  test('should ignore errors when task is aborted', async () => {
    const task = new AbortedErrorTask();
    const handleErrorSpy = vi.spyOn(task, 'handleError');
    const resultPromise = testMicroTaskRunner.push(task);
    task.abort();

    await waitForMicroTask();
    const result = await resultPromise;

    expect(result).toBeNull();
    // handleError should not be called because task was aborted
    expect(handleErrorSpy).not.toHaveBeenCalled();
  });
});
