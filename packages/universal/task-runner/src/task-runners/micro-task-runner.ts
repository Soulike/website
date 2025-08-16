import {AsyncCallbackTaskRunner} from './base/async-callback-task-runner.js';

class MicroTaskRunner extends AsyncCallbackTaskRunner {
  protected get asyncCallbackFunction() {
    return queueMicrotask.bind(globalThis);
  }
}

export const microTaskRunner = new MicroTaskRunner();
