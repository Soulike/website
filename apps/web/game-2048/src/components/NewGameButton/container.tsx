import {View} from './view.js';
import {useViewModel} from './view-model.js';

export interface NewGameButtonProps {
  className?: string;
}

export function NewGameButton({className}: NewGameButtonProps) {
  const {onNewGameButtonClick} = useViewModel();

  return <View onClick={onNewGameButtonClick} className={className} />;
}
