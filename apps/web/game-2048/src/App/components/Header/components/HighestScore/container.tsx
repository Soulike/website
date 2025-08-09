import {ScoreCard} from '../ScoreCard/index.js';
import {useViewModel} from './view-model.js';

export function HighestScore() {
  const {highestScore} = useViewModel();

  return <ScoreCard label='Best' value={highestScore} />;
}
