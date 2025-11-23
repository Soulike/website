import {SyncTaskRunner} from './base/sync-task-runner.js';

/**
 * Task runner that executes tasks in the microtask queue for high-priority async operations.
 *
 * Use this runner for tasks that should execute before the next event loop cycle, such as:
 * - Promise resolution handlers
 * - DOM mutations that need immediate processing
 * - State updates that should be synchronous from user perspective
 * - Critical async operations that need to run before rendering
 *
 * Microtasks have higher priority than macro tasks (setTimeout, I/O events) and will
 * execute before them in the event loop.
 *
 * @example
 * ```typescript
 * import { microTaskRunner } from './micro-task-runner.js';
 *
 * // Execute a high-priority async operation
 * const result = await microTaskRunner.push(urgentTask);
 * ```
 */
class MicroTaskRunner extends SyncTaskRunner {
  protected get queueFunction() {
    return queueMicrotask.bind(globalThis);
  }
}

/**
 * Pre-configured microtask runner instance ready for immediate use.
 * Tasks will be queued in the microtask queue for high-priority execution.
 */
export const microTaskRunner = new MicroTaskRunner();
