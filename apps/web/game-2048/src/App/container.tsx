import {useEffect} from 'react';

import {model} from '@/model/index.js';

import {View} from './view.js';
import {useViewModel} from './view-model.js';

export function App() {
  const {isGameOverModalOpen, onCloseGameOverModal} = useViewModel();

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
