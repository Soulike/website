import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {PromiseTask} from '@/tasks/promise-task.js';

import {concurrentPromiseTaskRunner} from './concurrent-promise-task-runner.js';

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
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  describe('concurrent execution behavior', () => {
    it('should execute multiple functions concurrently', async () => {
      const runner = concurrentPromiseTaskRunner;
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

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

      // Fast-forward time to complete delays
      await vi.advanceTimersByTimeAsync(50);

      const [result1, result2, result3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);

      expect(mockFunc1).toHaveBeenCalledOnce();
      expect(mockFunc2).toHaveBeenCalledOnce();
      expect(mockFunc3).toHaveBeenCalledOnce();

      expect(result1).toEqual({error: null, result: 'result1'});
      expect(result2).toEqual({error: null, result: 'result2'});
      expect(result3).toEqual({error: null, result: 'result3'});
    });

    it('should execute multiple tasks concurrently', async () => {
      const runner = concurrentPromiseTaskRunner;
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

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

      // Fast-forward time to complete delays
      await vi.advanceTimersByTimeAsync(30);

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(mockRun1).toHaveBeenCalledOnce();
      expect(mockRun2).toHaveBeenCalledOnce();

      expect(result1).toEqual({error: null, result: 'task1'});
      expect(result2).toEqual({error: null, result: 'task2'});
    });

    it('should handle mixed function and task execution concurrently', async () => {
      const runner = concurrentPromiseTaskRunner;
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

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

      // Fast-forward time to complete delays
      await vi.advanceTimersByTimeAsync(40);

      const [functionResult, taskResult] = await Promise.all([
        functionPromise,
        taskPromise,
      ]);

      expect(mockFunc).toHaveBeenCalledOnce();
      expect(mockRun).toHaveBeenCalledOnce();

      expect(functionResult).toEqual({error: null, result: 'function'});
      expect(taskResult).toEqual({error: null, result: 'task'});
    });
  });

  describe('error handling in concurrent execution', () => {
    it('should handle errors independently across concurrent tasks', async () => {
      const runner = concurrentPromiseTaskRunner;

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
      const runner = concurrentPromiseTaskRunner;
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const fastFunc = vi.fn(() => Promise.resolve('fast'));
      const slowFunc = vi.fn(async () => {
        await delay(100);
        return 'slow';
      });

      // Start slow task first
      const slowPromise = runner.push(slowFunc);
      // Start fast task immediately after
      const fastPromise = runner.push(fastFunc);

      // Fast task should complete quickly (no delay)
      const fastResult = await fastPromise;
      expect(fastResult).toEqual({error: null, result: 'fast'});

      // Fast-forward time to complete slow task
      await vi.advanceTimersByTimeAsync(100);

      // Slow task should still complete correctly
      const slowResult = await slowPromise;
      expect(slowResult).toEqual({error: null, result: 'slow'});
    });
  });
});
