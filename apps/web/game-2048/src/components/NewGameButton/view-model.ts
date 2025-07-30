import type {ButtonProps} from '@mui/material';
import {useCallback} from 'react';

import {model} from '@/model/index.js';

export function useViewModel() {
  const onNewGameButtonClick: ButtonProps['onClick'] = useCallback(() => {
    model.resetGame();
  }, []);

  return {
    onNewGameButtonClick,
  };
}
