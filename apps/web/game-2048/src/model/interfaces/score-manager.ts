import type {EventEmitter} from 'node:events';

export interface ScoreManager extends EventEmitter<ScoreManagerEvents> {
  resetScore(): void;
  getScore(): number;
  addToScore(scoreChange: number): void;
}

export type ScoreChangeEventListener = (score: number) => void;

export interface ScoreManagerEvents {
  scoreChange: Parameters<ScoreChangeEventListener>;
}
