import {EventEmitter} from 'node:events';

import type {
  ScoreManager,
  ScoreManagerEvents,
} from '../interfaces/score-manager.js';

export class ScoreManagerImpl
  extends EventEmitter<ScoreManagerEvents>
  implements ScoreManager
{
  private score = 0;

  public resetScore() {
    this.score = 0;
    this.emitScoreChangeEvent();
  }

  public getScore(): number {
    return this.score;
  }

  public addToScore(scoreChange: number) {
    this.score += scoreChange;
    this.emitScoreChangeEvent();
  }

  private emitScoreChangeEvent() {
    this.emit('scoreChange', this.score);
  }
}
