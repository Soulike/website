import {useHighestScore} from '@/hooks/useHighestScore.js';

export function useViewModel() {
  const highestScore = useHighestScore();
  return {highestScore};
}
