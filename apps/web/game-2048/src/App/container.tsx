import {useEffect} from 'react';

import {UIColorValue} from '@/constants/colors/index.js';
import {model} from '@/model/index.js';

import {View} from './view.js';
import {useViewModel} from './view-model.js';

export function App() {
  const {isGameOverModalOpen, onCloseGameOverModal} = useViewModel();

  useEffect(() => {
    model.resetGame();
  }, []);

  return (
    <>
      <meta name='theme-color' content={UIColorValue.BACKGROUND} />
      <View
        isGameOverModalOpen={isGameOverModalOpen}
        onCloseGameOverModal={onCloseGameOverModal}
      />
    </>
  );
}
