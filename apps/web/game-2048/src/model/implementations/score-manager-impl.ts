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
  private highestScore = 0;
  private readonly storageKey = 'game-2048-highest-score';

  constructor() {
    super();
    this.loadHighestScore();
  }

  public resetScore() {
    this.score = 0;
    this.emitScoreChangeEvent();
  }

  public getScore(): number {
    return this.score;
  }

  public getHighestScore(): number {
    return this.highestScore;
  }

  public addToScore(scoreChange: number) {
    this.score += scoreChange;
    this.updateHighestScore();
    this.emitScoreChangeEvent();
  }

  private loadHighestScore() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored !== null) {
        this.highestScore = Number.parseInt(stored, 10);
      } else {
        this.highestScore = 0;
      }
    } catch (error) {
      console.error(
        'Failed to load highest score from localStorage, resetting to 0:',
        error,
      );
      this.highestScore = 0;
      try {
        localStorage.setItem(this.storageKey, '0');
      } catch (saveError) {
        console.error(
          'Failed to reset highest score in localStorage:',
          saveError,
        );
      }
    }
  }

  private updateHighestScore() {
    if (this.score <= this.highestScore) {
      return;
    }
    this.highestScore = this.score;
    this.saveHighestScore();
    this.emitHighestScoreChangeEvent();
  }

  private saveHighestScore() {
    try {
      localStorage.setItem(this.storageKey, this.highestScore.toString());
    } catch (error) {
      console.error('Failed to save highest score to localStorage:', error);
    }
  }

  private emitScoreChangeEvent() {
    this.emit('scoreChange', this.score);
  }

  private emitHighestScoreChangeEvent() {
    this.emit('highestScoreChange', this.highestScore);
  }
}
