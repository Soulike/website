import {deepFreeze} from '@website/helpers/object';

import {EN_US} from './en-us.js';

export const ZH_CN: typeof EN_US = deepFreeze({
  UI_MESSAGE: {
    NETWORK_ERROR: '网络错误',
  },
});
