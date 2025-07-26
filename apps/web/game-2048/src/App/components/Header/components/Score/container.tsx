import {View} from './view.js';
import {useViewModel} from './view-model.js';

export function Score() {
  const {score} = useViewModel();

  return <View score={score} />;
}
