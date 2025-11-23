import {queueMacroTask} from '@library/async-helpers';

import {SyncTaskRunner} from './base/sync-task-runner.js';

/**
 * Task runner that executes tasks in the macro task queue for lower-priority operations.
 *
 * Use this runner for tasks that should execute in the next event loop cycle, such as:
 * - Background processing that doesn't need immediate execution
 * - Deferred cleanup operations
 * - Non-critical async operations
 * - Tasks that should not block the current execution flow
 *
 * Macro tasks have lower priority than microtasks and will execute after all microtasks
 * have completed. They're scheduled using setTimeout with 0ms delay.
 *
 * @example
 * ```typescript
 * import { macroTaskRunner } from './macro-task-runner.js';
 *
 * // Execute a background operation
 * const result = await macroTaskRunner.push(backgroundTask);
 * ```
 */
class MacroTaskRunner extends SyncTaskRunner {
  protected get queueFunction() {
    return queueMacroTask;
  }
}

/**
 * Pre-configured macro task runner instance ready for immediate use.
 * Tasks will be queued in the macro task queue for deferred execution.
 */
export const macroTaskRunner = new MacroTaskRunner();
