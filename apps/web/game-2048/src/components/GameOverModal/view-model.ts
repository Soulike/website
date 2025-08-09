import {useHighestScore} from '@/hooks/useHighestScore.js';
import {useScore} from '@/hooks/useScore.js';

export function useViewModel() {
  const score = useScore();
  const highestScore = useHighestScore();
  const isNewRecord = score > 0 && score === highestScore;

  return {
    score,
    highestScore,
    isNewRecord,
  };
}
