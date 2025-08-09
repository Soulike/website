import {View} from './view.js';
import {useViewModel} from './view-model.js';

export interface GameOverModalProps {
  open: boolean;
  onClose: () => void;
}

export function GameOverModal(props: GameOverModalProps) {
  const viewModel = useViewModel();
  return <View {...props} {...viewModel} />;
}
