import {View} from './view.js';
import {useViewModel} from './view-model.js';

export function NewGameButton() {
  const {onNewGameButtonClick} = useViewModel();

  return <View onClick={onNewGameButtonClick} />;
}
