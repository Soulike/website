import {STRING_KEY, useI18nString} from '@/i18n/index.js';

import {ScoreCard} from '../ScoreCard/index.js';
import {useViewModel} from './view-model.js';

export function HighestScore() {
  const {highestScore} = useViewModel();
  const bestLabel = useI18nString(STRING_KEY.BEST_SCORE_LABEL);

  return <ScoreCard label={bestLabel} value={highestScore} />;
}
