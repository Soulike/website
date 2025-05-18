import {AsyncCallbackTaskRunner} from '../async-callback-task-runner.js';

class TestMicroTaskRunner extends AsyncCallbackTaskRunner {
  protected get asyncCallbackFunction() {
    return queueMicrotask;
  }
}

export const testMicroTaskRunner = new TestMicroTaskRunner();
