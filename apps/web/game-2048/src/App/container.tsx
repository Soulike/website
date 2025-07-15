import {useEffect} from 'react';

import {useArrowKeys} from '@/hooks/useArrowKeys.js';
import {model, MoveDirection} from '@/model/index.js';

import {View} from './view.js';

export function App() {
  useArrowKeys({
    onUp: () => model.move(MoveDirection.UP),
    onDown: () => model.move(MoveDirection.DOWN),
    onLeft: () => model.move(MoveDirection.LEFT),
    onRight: () => model.move(MoveDirection.RIGHT),
  });

  useEffect(() => {
    model.init();
  }, []);

  return <View />;
}
