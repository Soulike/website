import {describe, expect, it, vi} from 'vitest';

import {PromiseTask} from '@/tasks/promise-task.js';

import {ConcurrentPromiseTaskRunner} from './concurrent-promise-task-runner.js';

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

describe('ConcurrentPromiseTaskRunner', () => {
  describe('concurrent execution behavior', () => {
    it('should execute multiple functions concurrently', async () => {
      const runner = new ConcurrentPromiseTaskRunner();
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const startTime = Date.now();
      const mockFunc1 = vi.fn(async () => {
        await delay(50);
        return 'result1';
      });
      const mockFunc2 = vi.fn(async () => {
        await delay(50);
        return 'result2';
      });
      const mockFunc3 = vi.fn(async () => {
        await delay(50);
        return 'result3';
      });

      // Start all tasks simultaneously
      const promise1 = runner.push(mockFunc1);
      const promise2 = runner.push(mockFunc2);
      const promise3 = runner.push(mockFunc3);

      const [result1, result2, result3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);
      const endTime = Date.now();

      // Should complete in roughly 50ms (concurrent) rather than 150ms (sequential)
      expect(endTime - startTime).toBeLessThan(100);

      expect(mockFunc1).toHaveBeenCalledOnce();
      expect(mockFunc2).toHaveBeenCalledOnce();
      expect(mockFunc3).toHaveBeenCalledOnce();

      expect(result1).toEqual({error: null, result: 'result1'});
      expect(result2).toEqual({error: null, result: 'result2'});
      expect(result3).toEqual({error: null, result: 'result3'});
    });

    it('should execute multiple tasks concurrently', async () => {
      const runner = new ConcurrentPromiseTaskRunner();
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const startTime = Date.now();
      const mockRun1 = vi.fn(async () => {
        await delay(30);
        return 'task1';
      });
      const mockRun2 = vi.fn(async () => {
        await delay(30);
        return 'task2';
      });

      const task1 = new MockPromiseTask(mockRun1);
      const task2 = new MockPromiseTask(mockRun2);

      // Start both tasks simultaneously
      const promise1 = runner.push(task1);
      const promise2 = runner.push(task2);

      const [result1, result2] = await Promise.all([promise1, promise2]);
      const endTime = Date.now();

      // Should complete in roughly 30ms (concurrent) rather than 60ms (sequential)
      expect(endTime - startTime).toBeLessThan(60);

      expect(mockRun1).toHaveBeenCalledOnce();
      expect(mockRun2).toHaveBeenCalledOnce();

      expect(result1).toEqual({error: null, result: 'task1'});
      expect(result2).toEqual({error: null, result: 'task2'});
    });

    it('should handle mixed function and task execution concurrently', async () => {
      const runner = new ConcurrentPromiseTaskRunner();
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const startTime = Date.now();
      const mockFunc = vi.fn(async () => {
        await delay(40);
        return 'function';
      });
      const mockRun = vi.fn(async () => {
        await delay(40);
        return 'task';
      });

      const task = new MockPromiseTask(mockRun);

      // Start both simultaneously
      const functionPromise = runner.push(mockFunc);
      const taskPromise = runner.push(task);

      const [functionResult, taskResult] = await Promise.all([
        functionPromise,
        taskPromise,
      ]);
      const endTime = Date.now();

      // Should complete in roughly 40ms (concurrent)
      expect(endTime - startTime).toBeLessThan(80);

      expect(mockFunc).toHaveBeenCalledOnce();
      expect(mockRun).toHaveBeenCalledOnce();

      expect(functionResult).toEqual({error: null, result: 'function'});
      expect(taskResult).toEqual({error: null, result: 'task'});
    });
  });

  describe('error handling in concurrent execution', () => {
    it('should handle errors independently across concurrent tasks', async () => {
      const runner = new ConcurrentPromiseTaskRunner();

      const successFunc = vi.fn(() => Promise.resolve('success'));
      const errorFunc = vi.fn(() => Promise.reject(new Error('error')));

      // Start both simultaneously
      const successPromise = runner.push(successFunc);
      const errorPromise = runner.push(errorFunc);

      const [successResult, errorResult] = await Promise.all([
        successPromise,
        errorPromise,
      ]);

      expect(successResult).toEqual({
        error: null,
        result: 'success',
      });

      expect(errorResult.error).toBeInstanceOf(Error);
      expect(errorResult.error?.message).toBe('Error during task execution.');
      expect(errorResult.result).toBe(null);
    });
  });

  describe('performance characteristics', () => {
    it('should not block when one task is slow', async () => {
      const runner = new ConcurrentPromiseTaskRunner();
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const fastFunc = vi.fn(() => Promise.resolve('fast'));
      const slowFunc = vi.fn(async () => {
        await delay(100);
        return 'slow';
      });

      const startTime = Date.now();

      // Start slow task first
      const slowPromise = runner.push(slowFunc);
      // Start fast task immediately after
      const fastPromise = runner.push(fastFunc);

      // Fast task should complete quickly
      const fastResult = await fastPromise;
      const fastEndTime = Date.now();

      expect(fastEndTime - startTime).toBeLessThan(50);
      expect(fastResult).toEqual({error: null, result: 'fast'});

      // Slow task should still complete correctly
      const slowResult = await slowPromise;
      expect(slowResult).toEqual({error: null, result: 'slow'});
    });
  });
});
