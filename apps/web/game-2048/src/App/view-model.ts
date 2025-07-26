import {useCallback, useEffect, useState} from 'react';

import {
  GameState,
  type GameStateChangeEventListener,
  model,
} from '@/model/index.js';

export function useViewModel() {
  const isGameOver = useIsGameOver();
  return {isGameOver};
}

export function useIsGameOver() {
  const [isGameOver, setIsGameOver] = useState(model.isGameOver());

  const onGameStateChange: GameStateChangeEventListener = useCallback(
    (state) => {
      setIsGameOver(state === GameState.NEED_RESTART);
    },
    [],
  );

  useEffect(() => {
    model.addListener('gameStateChange', onGameStateChange);
    return () => {
      model.removeListener('gameStateChange', onGameStateChange);
    };
  }, [onGameStateChange]);

  return isGameOver;
}
