import {describe, expect, it, vi} from 'vitest';

import {PromiseTask} from '@/tasks/promise-task.js';

import {sequentialPromiseTaskRunner} from './sequential-promise-task-runner.js';

class MockPromiseTask<T> extends PromiseTask<T> {
  private readonly mockRun: () => Promise<T | null>;

  public constructor(runImpl: () => Promise<T | null>) {
    super();
    this.mockRun = runImpl;
  }

  public run(): Promise<T | null> {
    return this.mockRun();
  }
}

describe('SequentialPromiseTaskRunner', () => {
  describe('sequential execution behavior', () => {
    it('should execute multiple functions sequentially in order', async () => {
      const runner = sequentialPromiseTaskRunner;
      const executionOrder: string[] = [];
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const mockFunc1 = vi.fn(async () => {
        executionOrder.push('func1-start');
        await delay(30);
        executionOrder.push('func1-end');
        return 'result1';
      });
      const mockFunc2 = vi.fn(async () => {
        executionOrder.push('func2-start');
        await delay(20);
        executionOrder.push('func2-end');
        return 'result2';
      });
      const mockFunc3 = vi.fn(async () => {
        executionOrder.push('func3-start');
        await delay(10);
        executionOrder.push('func3-end');
        return 'result3';
      });

      // Start all tasks
      const promise1 = runner.push(mockFunc1);
      const promise2 = runner.push(mockFunc2);
      const promise3 = runner.push(mockFunc3);

      const [result1, result2, result3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);

      // Verify sequential execution order
      expect(executionOrder).toEqual([
        'func1-start',
        'func1-end',
        'func2-start',
        'func2-end',
        'func3-start',
        'func3-end',
      ]);

      expect(result1).toEqual({error: null, result: 'result1'});
      expect(result2).toEqual({error: null, result: 'result2'});
      expect(result3).toEqual({error: null, result: 'result3'});
    });

    it('should execute multiple tasks sequentially in order', async () => {
      const runner = sequentialPromiseTaskRunner;
      const executionOrder: string[] = [];
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const mockRun1 = vi.fn(async () => {
        executionOrder.push('task1-start');
        await delay(25);
        executionOrder.push('task1-end');
        return 'task1';
      });
      const mockRun2 = vi.fn(async () => {
        executionOrder.push('task2-start');
        await delay(15);
        executionOrder.push('task2-end');
        return 'task2';
      });

      const task1 = new MockPromiseTask(mockRun1);
      const task2 = new MockPromiseTask(mockRun2);

      // Start both tasks
      const promise1 = runner.push(task1);
      const promise2 = runner.push(task2);

      const [result1, result2] = await Promise.all([promise1, promise2]);

      // Verify sequential execution order
      expect(executionOrder).toEqual([
        'task1-start',
        'task1-end',
        'task2-start',
        'task2-end',
      ]);

      expect(result1).toEqual({error: null, result: 'task1'});
      expect(result2).toEqual({error: null, result: 'task2'});
    });

    it('should execute mixed functions and tasks sequentially', async () => {
      const runner = sequentialPromiseTaskRunner;
      const executionOrder: string[] = [];
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const mockFunc = vi.fn(async () => {
        executionOrder.push('func-start');
        await delay(20);
        executionOrder.push('func-end');
        return 'function';
      });
      const mockRun = vi.fn(async () => {
        executionOrder.push('task-start');
        await delay(20);
        executionOrder.push('task-end');
        return 'task';
      });

      const task = new MockPromiseTask(mockRun);

      // Start function first, then task
      const functionPromise = runner.push(mockFunc);
      const taskPromise = runner.push(task);

      const [functionResult, taskResult] = await Promise.all([
        functionPromise,
        taskPromise,
      ]);

      // Verify sequential execution order
      expect(executionOrder).toEqual([
        'func-start',
        'func-end',
        'task-start',
        'task-end',
      ]);

      expect(functionResult).toEqual({error: null, result: 'function'});
      expect(taskResult).toEqual({error: null, result: 'task'});
    });
  });

  describe('timing and performance characteristics', () => {
    it('should take sequential time rather than concurrent time', async () => {
      const runner = sequentialPromiseTaskRunner;
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const startTime = Date.now();
      const mockFunc1 = vi.fn(async () => {
        await delay(30);
        return 'result1';
      });
      const mockFunc2 = vi.fn(async () => {
        await delay(30);
        return 'result2';
      });
      const mockFunc3 = vi.fn(async () => {
        await delay(30);
        return 'result3';
      });

      // Start all tasks
      const promise1 = runner.push(mockFunc1);
      const promise2 = runner.push(mockFunc2);
      const promise3 = runner.push(mockFunc3);

      await Promise.all([promise1, promise2, promise3]);
      const endTime = Date.now();

      // Should take roughly 90ms (sequential) rather than 30ms (concurrent)
      expect(endTime - startTime).toBeGreaterThan(80);
      expect(endTime - startTime).toBeLessThan(120);
    });

    it('should not start next task until previous completes', async () => {
      const runner = sequentialPromiseTaskRunner;
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      let task1Completed = false;
      let task2Started = false;

      const mockFunc1 = vi.fn(async () => {
        await delay(50);
        task1Completed = true;
        return 'result1';
      });
      const mockFunc2 = vi.fn(() => {
        task2Started = true;
        // Task 2 should not start until task 1 is completed
        expect(task1Completed).toBe(true);
        return Promise.resolve('result2');
      });

      // Start both tasks
      const promise1 = runner.push(mockFunc1);
      const promise2 = runner.push(mockFunc2);

      await Promise.all([promise1, promise2]);

      expect(task2Started).toBe(true);
      expect(task1Completed).toBe(true);
    });
  });

  describe('queue processing', () => {
    it('should handle tasks added while queue is processing', async () => {
      const runner = sequentialPromiseTaskRunner;
      const executionOrder: string[] = [];
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const mockFunc1 = vi.fn(async () => {
        executionOrder.push('func1');
        await delay(20);
        return 'result1';
      });
      const mockFunc2 = vi.fn(async () => {
        executionOrder.push('func2');
        await delay(10);
        return 'result2';
      });

      // Start first task
      const promise1 = runner.push(mockFunc1);

      // Add second task after a short delay (while first is running)
      await new Promise((resolve) => setTimeout(resolve, 10));
      const promise2 = runner.push(mockFunc2);

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(executionOrder).toEqual(['func1', 'func2']);
      expect(result1).toEqual({error: null, result: 'result1'});
      expect(result2).toEqual({error: null, result: 'result2'});
    });

    it('should handle errors without blocking subsequent tasks', async () => {
      const runner = sequentialPromiseTaskRunner;
      const executionOrder: string[] = [];

      const errorFunc = vi.fn(() => {
        executionOrder.push('error-func');
        return Promise.reject(new Error('test error'));
      });
      const successFunc = vi.fn(() => {
        executionOrder.push('success-func');
        return Promise.resolve('success');
      });

      // Start error task first, then success task
      const errorPromise = runner.push(errorFunc);
      const successPromise = runner.push(successFunc);

      const [errorResult, successResult] = await Promise.all([
        errorPromise,
        successPromise,
      ]);

      expect(executionOrder).toEqual(['error-func', 'success-func']);

      expect(errorResult.error).toBeInstanceOf(Error);
      expect(errorResult.result).toBe(null);

      expect(successResult).toEqual({error: null, result: 'success'});
    });
  });
});
