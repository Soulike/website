import {View} from './view.js';
import {useViewModel} from './view-model.js';

export function Header() {
  const {onNewGameButtonClick} = useViewModel();

  return <View onNewGameButtonClick={onNewGameButtonClick} />;
}
