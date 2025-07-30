import {View} from './view.js';

export interface GameOverModalProps {
  open: boolean;
  onClose: () => void;
}

export function GameOverModal(props: GameOverModalProps) {
  return <View {...props} />;
}
