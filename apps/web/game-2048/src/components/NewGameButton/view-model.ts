import {useCallback} from 'react';

import {type ButtonProps} from '@/components/Button/index.js';
import {model} from '@/model/index.js';

export function useViewModel() {
  const onNewGameButtonClick: ButtonProps['onClick'] = useCallback(() => {
    model.resetGame();
  }, []);

  return {
    onNewGameButtonClick,
  };
}
