import {useCallback, useEffect, useState} from 'react';

import {type HighestScoreChangeEventListener, model} from '@/model/index.js';

export function useHighestScore() {
  const [highestScore, setHighestScore] = useState(model.getHighestScore());
  const onHighestScoreChange: HighestScoreChangeEventListener = useCallback(
    (highestScore) => {
      setHighestScore(highestScore);
    },
    [],
  );

  useEffect(() => {
    model.addListener('highestScoreChange', onHighestScoreChange);
    return () => {
      model.removeListener('highestScoreChange', onHighestScoreChange);
    };
  }, [onHighestScoreChange]);

  return highestScore;
}
