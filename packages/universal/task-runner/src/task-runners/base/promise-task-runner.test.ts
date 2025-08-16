import {describe, expect, it, vi} from 'vitest';

import {PromiseTask} from '@/tasks/promise-task.js';

import {PromiseTaskRunner} from './promise-task-runner.js';

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

class MockPromiseTaskWithTeardown<T> extends PromiseTask<T> {
  public readonly mockTeardown: () => Promise<void>;
  private readonly mockRun: () => Promise<T | null>;

  public constructor(runImpl: () => Promise<T | null>) {
    super();
    this.mockRun = runImpl;
    this.mockTeardown = vi.fn();
  }

  public run(): Promise<T | null> {
    return this.mockRun();
  }

  public async teardown(): Promise<void> {
    await this.mockTeardown();
    await super.teardown();
  }
}

describe('PromiseTaskRunner', () => {
  describe('push with function', () => {
    it('should execute function and return success result', async () => {
      const runner = new PromiseTaskRunner();
      const testValue = 'test result';
      const mockFunc = vi.fn(() => Promise.resolve(testValue));

      const result = await runner.push(mockFunc);

      expect(mockFunc).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: testValue,
      });
    });

    it('should handle function throwing error', async () => {
      const runner = new PromiseTaskRunner();
      const testError = new Error('test error');
      const mockFunc = vi.fn(() => Promise.reject(testError));

      const result = await runner.push(mockFunc);

      expect(mockFunc).toHaveBeenCalledOnce();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Error during task execution.');
      expect(result.error?.cause).toBe(testError);
      expect(result.result).toBe(null);
    });
  });

  describe('push with PromiseTask', () => {
    it('should execute task and return success result', async () => {
      const runner = new PromiseTaskRunner();
      const testValue = 42;
      const mockRun = vi.fn(() => Promise.resolve(testValue));
      const task = new MockPromiseTask(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: testValue,
      });
    });

    it('should handle task throwing error', async () => {
      const runner = new PromiseTaskRunner();
      const testError = new Error('task error');
      const mockRun = vi.fn(async () => {
        return Promise.reject(testError);
      });
      const task = new MockPromiseTask(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Error during task execution.');
      expect(result.error?.cause).toBe(testError);
      expect(result.result).toBe(null);
    });

    it('should handle task returning null (cancelled)', async () => {
      const runner = new PromiseTaskRunner();
      const mockRun = vi.fn(() => Promise.resolve(null));
      const task = new MockPromiseTask(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: null,
      });
    });

    it('should not execute aborted task', async () => {
      const runner = new PromiseTaskRunner();
      const mockRun = vi.fn(() => {
        // This won't be called since task is aborted
        return Promise.resolve(null);
      });
      const task = new MockPromiseTask(mockRun);
      task.abort();

      const result = await runner.push(task);

      expect(mockRun).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: null,
        result: null,
      });
    });

    it('should handle task returning null', async () => {
      const runner = new PromiseTaskRunner();
      const mockRun = vi.fn(() => Promise.resolve(null));
      const task = new MockPromiseTask(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: null,
      });
    });
  });

  describe('error handling', () => {
    it('should wrap thrown errors with descriptive message', async () => {
      const runner = new PromiseTaskRunner();
      const originalError = new TypeError('original error');
      const mockFunc = vi.fn(() => Promise.reject(originalError));

      const result = await runner.push(mockFunc);

      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Error during task execution.');
      expect(result.error?.cause).toBe(originalError);
      expect(result.result).toBe(null);
    });

    it('should handle non-Error thrown values', async () => {
      const runner = new PromiseTaskRunner();
      const thrownValue = 'string error';
      const mockFunc = vi.fn(() => Promise.reject(new Error(thrownValue)));

      const result = await runner.push(mockFunc);

      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Error during task execution.');
      expect(result.error?.cause).toBeInstanceOf(Error);
      expect((result.error?.cause as Error).message).toBe(thrownValue);
      expect(result.result).toBe(null);
    });
  });

  describe('teardown behavior', () => {
    it('should call teardown on successful task execution', async () => {
      const runner = new PromiseTaskRunner();
      const testValue = 'success';
      const mockRun = vi.fn(() => Promise.resolve(testValue));
      const task = new MockPromiseTaskWithTeardown(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(task.mockTeardown).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: testValue,
      });
    });

    it('should call teardown even when task throws error', async () => {
      const runner = new PromiseTaskRunner();
      const testError = new Error('execution error');
      const mockRun = vi.fn(() => Promise.reject(testError));
      const task = new MockPromiseTaskWithTeardown(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(task.mockTeardown).toHaveBeenCalledOnce();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.result).toBe(null);
    });
  });
});
