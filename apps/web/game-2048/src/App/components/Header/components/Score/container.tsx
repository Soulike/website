import {ScoreCard} from '../ScoreCard/index.js';
import {useViewModel} from './view-model.js';

export function Score() {
  const {score} = useViewModel();

  return <ScoreCard label='Score' value={score} />;
}
