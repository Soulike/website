import {useEffect} from 'react';

import {useArrowKeys} from '@/hooks/useArrowKeys.js';
import {model, MoveDirection} from '@/model/index.js';

import {View} from './view.js';
import {useViewModel} from './view-model.js';

export function App() {
  const {isGameOver, isGameOverModalOpen, onCloseGameOverModal} =
    useViewModel();

  useArrowKeys({
    onUp: () => {
      if (!isGameOver) {
        model.move(MoveDirection.UP);
      }
    },
    onDown: () => {
      if (!isGameOver) {
        model.move(MoveDirection.DOWN);
      }
    },
    onLeft: () => {
      if (!isGameOver) {
        model.move(MoveDirection.LEFT);
      }
    },
    onRight: () => {
      if (!isGameOver) {
        model.move(MoveDirection.RIGHT);
      }
    },
  });

  useEffect(() => {
    model.resetGame();
  }, []);

  return (
    <View
      isGameOverModalOpen={isGameOverModalOpen}
      onCloseGameOverModal={onCloseGameOverModal}
    />
  );
}
