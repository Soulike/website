import {useScore} from '@/hooks/useScore.js';

export function useViewModel() {
  const score = useScore();
  return {score};
}
