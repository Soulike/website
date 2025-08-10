import type {EventEmitter} from 'node:events';

export interface ScoreManager extends EventEmitter<ScoreManagerEvents> {
  resetScore(): void;
  getScore(): number;
  addToScore(scoreChange: number): void;
  getHighestScore(): number;
}

export type ScoreChangeEventListener = (score: number) => void;
export type HighestScoreChangeEventListener = (highestScore: number) => void;

export interface ScoreManagerEvents {
  scoreChange: Parameters<ScoreChangeEventListener>;
  highestScoreChange: Parameters<HighestScoreChangeEventListener>;
}
