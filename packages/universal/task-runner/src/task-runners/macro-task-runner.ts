import {queueMacroTask} from '@universal/async-helpers';

import {AsyncCallbackTaskRunner} from './base/async-callback-task-runner.js';

class MacroTaskRunner extends AsyncCallbackTaskRunner {
  protected get asyncCallbackFunction() {
    return queueMacroTask;
  }
}

export const macroTaskRunner = new MacroTaskRunner();
