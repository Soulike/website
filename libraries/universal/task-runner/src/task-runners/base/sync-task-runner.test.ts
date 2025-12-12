import {describe, expect, it, vi} from 'vitest';

import {SyncTask} from '../../tasks/sync-task.js';
import {SyncTaskRunner} from './sync-task-runner.js';

class TestSyncTaskRunner extends SyncTaskRunner {
  protected get queueFunction(): typeof queueMicrotask {
    return queueMicrotask;
  }
}

class MockSyncTask<T> extends SyncTask<T> {
  private readonly mockRun: () => T | null;

  public constructor(runImpl: () => T | null) {
    super();
    this.mockRun = runImpl;
  }

  public run(): T | null {
    return this.mockRun();
  }
}

class MockSyncTaskWithTeardown<T> extends SyncTask<T> {
  public readonly mockTeardown: () => Promise<void>;
  private readonly mockRun: () => T | null;

  public constructor(runImpl: () => T | null) {
    super();
    this.mockRun = runImpl;
    this.mockTeardown = vi.fn();
  }

  public run(): T | null {
    return this.mockRun();
  }

  public async teardown(): Promise<void> {
    await this.mockTeardown();
    await super.teardown();
  }
}

describe('SyncTaskRunner', () => {
  describe('push with function', () => {
    it('should execute function and return success result', async () => {
      const runner = new TestSyncTaskRunner();
      const testValue = 'test result';
      const mockFunc = vi.fn(() => testValue);

      const result = await runner.push(mockFunc);

      expect(mockFunc).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: testValue,
      });
    });

    it('should handle function throwing error', async () => {
      const runner = new TestSyncTaskRunner();
      const testError = new Error('test error');
      const mockFunc = vi.fn(() => {
        throw testError;
      });

      const result = await runner.push(mockFunc);

      expect(mockFunc).toHaveBeenCalledOnce();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Error during task execution.');
      expect(result.error?.cause).toBe(testError);
      expect(result.result).toBe(null);
    });

    it('should handle function returning null (cancelled)', async () => {
      const runner = new TestSyncTaskRunner();
      const mockFunc = vi.fn(() => null);

      const result = await runner.push(mockFunc);

      expect(mockFunc).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: null,
      });
    });
  });

  describe('push with SyncTask', () => {
    it('should execute task and return success result', async () => {
      const runner = new TestSyncTaskRunner();
      const testValue = 42;
      const mockRun = vi.fn(() => testValue);
      const task = new MockSyncTask(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: testValue,
      });
    });

    it('should handle task throwing error', async () => {
      const runner = new TestSyncTaskRunner();
      const testError = new Error('task error');
      const mockRun = vi.fn(() => {
        throw testError;
      });
      const task = new MockSyncTask(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Error during task execution.');
      expect(result.error?.cause).toBe(testError);
      expect(result.result).toBe(null);
    });

    it('should handle task returning null (cancelled)', async () => {
      const runner = new TestSyncTaskRunner();
      const mockRun = vi.fn(() => null);
      const task = new MockSyncTask(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: null,
      });
    });

    it('should not execute aborted task', async () => {
      const runner = new TestSyncTaskRunner();
      const mockRun = vi.fn(() => {
        // This won't be called since task is aborted
        return null;
      });
      const task = new MockSyncTask(mockRun);
      task.abort();

      const result = await runner.push(task);

      expect(mockRun).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: null,
        result: null,
      });
    });
  });

  describe('error handling', () => {
    it('should wrap thrown errors with descriptive message', async () => {
      const runner = new TestSyncTaskRunner();
      const originalError = new TypeError('original error');
      const mockFunc = vi.fn(() => {
        throw originalError;
      });

      const result = await runner.push(mockFunc);

      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Error during task execution.');
      expect(result.error?.cause).toBe(originalError);
      expect(result.result).toBe(null);
    });

    it('should handle non-Error thrown values', async () => {
      const runner = new TestSyncTaskRunner();
      const thrownValue = 'string error';
      const mockFunc = vi.fn(() => {
        throw new Error(thrownValue);
      });

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
      const runner = new TestSyncTaskRunner();
      const testValue = 'success';
      const mockRun = vi.fn(() => testValue);
      const task = new MockSyncTaskWithTeardown(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(task.mockTeardown).toHaveBeenCalledOnce();
      expect(result).toEqual({
        error: null,
        result: testValue,
      });
    });

    it('should call teardown even when task throws error', async () => {
      const runner = new TestSyncTaskRunner();
      const testError = new Error('execution error');
      const mockRun = vi.fn(() => {
        throw testError;
      });
      const task = new MockSyncTaskWithTeardown(mockRun);

      const result = await runner.push(task);

      expect(mockRun).toHaveBeenCalledOnce();
      expect(task.mockTeardown).toHaveBeenCalledOnce();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.result).toBe(null);
    });
  });
});
