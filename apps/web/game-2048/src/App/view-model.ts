import {useModal} from '@website/hooks';
import {useCallback, useEffect, useState} from 'react';

import {
  GameState,
  type GameStateChangeEventListener,
  model,
} from '@/model/index.js';

export function useViewModel() {
  const isGameOver = useIsGameOver();
  const {
    visible: isGameOverModalOpen,
    hide: hideGameOverModal,
    show: showGameOverModal,
  } = useModal();

  useEffect(() => {
    if (isGameOver) {
      setTimeout(() => {
        showGameOverModal();
      }, 1000);
    } else {
      hideGameOverModal();
    }
  }, [hideGameOverModal, isGameOver, showGameOverModal]);

  return {
    isGameOver,
    isGameOverModalOpen,
    onCloseGameOverModal: hideGameOverModal,
  };
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
