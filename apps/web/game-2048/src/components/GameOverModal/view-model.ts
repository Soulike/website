import {useMemo} from 'react';

import {useHighestScore} from '@/hooks/useHighestScore.js';
import {useScore} from '@/hooks/useScore.js';

export function useViewModel() {
  const score = useScore();
  const highestScore = useHighestScore();
  const isNewRecord = useMemo(
    () => score > 0 && score === highestScore,
    [highestScore, score],
  );

  return {
    score,
    highestScore,
    isNewRecord,
  };
}
