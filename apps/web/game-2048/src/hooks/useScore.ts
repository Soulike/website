import {useCallback, useEffect, useState} from 'react';

import {model, type ScoreChangeEventListener} from '@/model/index.js';

export function useScore() {
  const [score, setScore] = useState(model.getScore());
  const onScoreChange: ScoreChangeEventListener = useCallback((score) => {
    setScore(score);
  }, []);

  useEffect(() => {
    model.addListener('scoreChange', onScoreChange);
    return () => {
      model.removeListener('scoreChange', onScoreChange);
    };
  }, [onScoreChange]);

  return score;
}
