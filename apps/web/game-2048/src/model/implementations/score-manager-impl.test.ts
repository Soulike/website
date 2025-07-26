import {describe, expect, it, vi} from 'vitest';

import {ScoreManagerImpl} from './score-manager-impl.js';

describe('ScoreManagerImpl', () => {
  describe('getScore', () => {
    it('should return initial score of 0', () => {
      const scoreManager = new ScoreManagerImpl();

      expect(scoreManager.getScore()).toBe(0);
    });
  });

  describe('addToScore', () => {
    it('should add positive score correctly', () => {
      const scoreManager = new ScoreManagerImpl();

      scoreManager.addToScore(10);
      expect(scoreManager.getScore()).toBe(10);

      scoreManager.addToScore(20);
      expect(scoreManager.getScore()).toBe(30);
    });

    it('should handle negative score changes', () => {
      const scoreManager = new ScoreManagerImpl();

      scoreManager.addToScore(50);
      scoreManager.addToScore(-20);
      expect(scoreManager.getScore()).toBe(30);
    });

    it('should handle zero score change', () => {
      const scoreManager = new ScoreManagerImpl();

      scoreManager.addToScore(10);
      scoreManager.addToScore(0);
      expect(scoreManager.getScore()).toBe(10);
    });

    it('should emit scoreChange event when adding to score', () => {
      const scoreManager = new ScoreManagerImpl();
      const listener = vi.fn();

      scoreManager.on('scoreChange', listener);
      scoreManager.addToScore(15);

      expect(listener).toHaveBeenCalledWith(15);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetScore', () => {
    it('should reset score to 0', () => {
      const scoreManager = new ScoreManagerImpl();

      scoreManager.addToScore(100);
      expect(scoreManager.getScore()).toBe(100);

      scoreManager.resetScore();
      expect(scoreManager.getScore()).toBe(0);
    });

    it('should emit scoreChange event when resetting score', () => {
      const scoreManager = new ScoreManagerImpl();
      const listener = vi.fn();

      scoreManager.addToScore(50);
      scoreManager.on('scoreChange', listener);
      scoreManager.resetScore();

      expect(listener).toHaveBeenCalledWith(0);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should emit scoreChange event even when score is already 0', () => {
      const scoreManager = new ScoreManagerImpl();
      const listener = vi.fn();

      scoreManager.on('scoreChange', listener);
      scoreManager.resetScore();

      expect(listener).toHaveBeenCalledWith(0);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('event emission', () => {
    it('should emit scoreChange events for multiple listeners', () => {
      const scoreManager = new ScoreManagerImpl();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      scoreManager.on('scoreChange', listener1);
      scoreManager.on('scoreChange', listener2);
      scoreManager.addToScore(25);

      expect(listener1).toHaveBeenCalledWith(25);
      expect(listener2).toHaveBeenCalledWith(25);
    });

    it('should not emit events after listener is removed', () => {
      const scoreManager = new ScoreManagerImpl();
      const listener = vi.fn();

      scoreManager.on('scoreChange', listener);
      scoreManager.addToScore(10);
      expect(listener).toHaveBeenCalledTimes(1);

      scoreManager.off('scoreChange', listener);
      scoreManager.addToScore(20);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should emit correct score values in sequence', () => {
      const scoreManager = new ScoreManagerImpl();
      const scores: number[] = [];

      scoreManager.on('scoreChange', (score) => scores.push(score));

      scoreManager.addToScore(10);
      scoreManager.addToScore(15);
      scoreManager.resetScore();
      scoreManager.addToScore(5);

      expect(scores).toEqual([10, 25, 0, 5]);
    });
  });
});
