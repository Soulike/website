import {STRING_KEY, useI18nString} from '@/i18n/index.js';

import {ScoreCard} from '../ScoreCard/index.js';
import {useViewModel} from './view-model.js';

export function Score() {
  const {score} = useViewModel();
  const scoreLabel = useI18nString(STRING_KEY.SCORE_LABEL);

  return <ScoreCard label={scoreLabel} value={score} />;
}
