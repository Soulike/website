import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {ScoreManagerImpl} from './score-manager-impl.js';

describe('ScoreManagerImpl', () => {
  let originalLocalStorage: Storage;

  beforeEach(() => {
    originalLocalStorage = window.localStorage;
    localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });
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

  describe('getHighestScore', () => {
    it('should return initial highest score of 0 when no localStorage value', () => {
      const scoreManager = new ScoreManagerImpl();

      expect(scoreManager.getHighestScore()).toBe(0);
    });

    it('should load highest score from localStorage on initialization', () => {
      localStorage.setItem('game-2048-highest-score', '150');
      const scoreManager = new ScoreManagerImpl();

      expect(scoreManager.getHighestScore()).toBe(150);
    });

    it('should update highest score when current score exceeds it', () => {
      localStorage.setItem('game-2048-highest-score', '50');
      const scoreManager = new ScoreManagerImpl();

      scoreManager.addToScore(100);
      expect(scoreManager.getHighestScore()).toBe(100);
    });

    it('should not update highest score when current score is lower', () => {
      localStorage.setItem('game-2048-highest-score', '100');
      const scoreManager = new ScoreManagerImpl();

      scoreManager.addToScore(50);
      expect(scoreManager.getHighestScore()).toBe(100);
    });
  });

  describe('localStorage persistence', () => {
    it('should save highest score to localStorage when updated', () => {
      localStorage.setItem('game-2048-highest-score', '50');
      const scoreManager = new ScoreManagerImpl();

      scoreManager.addToScore(100);

      expect(localStorage.getItem('game-2048-highest-score')).toBe('100');
    });

    it('should handle localStorage.getItem errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn().mockImplementation(() => {
            throw new Error('localStorage unavailable');
          }),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });

      const scoreManager = new ScoreManagerImpl();

      expect(scoreManager.getHighestScore()).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load highest score from localStorage, resetting to 0:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should handle localStorage.setItem errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      const scoreManager = new ScoreManagerImpl();

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn().mockReturnValue('50'),
          setItem: vi.fn().mockImplementation(() => {
            throw new Error('localStorage quota exceeded');
          }),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });

      scoreManager.addToScore(100);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save highest score to localStorage:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('highestScoreChange event', () => {
    it('should emit highestScoreChange event when highest score is updated', () => {
      localStorage.setItem('game-2048-highest-score', '50');
      const scoreManager = new ScoreManagerImpl();
      const listener = vi.fn();

      scoreManager.on('highestScoreChange', listener);
      scoreManager.addToScore(100);

      expect(listener).toHaveBeenCalledWith(100);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not emit highestScoreChange event when score does not exceed highest', () => {
      localStorage.setItem('game-2048-highest-score', '100');
      const scoreManager = new ScoreManagerImpl();
      const listener = vi.fn();

      scoreManager.on('highestScoreChange', listener);
      scoreManager.addToScore(50);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should emit highestScoreChange event for multiple score updates', () => {
      const scoreManager = new ScoreManagerImpl();
      const listener = vi.fn();

      scoreManager.on('highestScoreChange', listener);
      scoreManager.addToScore(50);
      scoreManager.addToScore(25); // Total 75
      scoreManager.addToScore(50); // Total 125

      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenNthCalledWith(1, 50);
      expect(listener).toHaveBeenNthCalledWith(2, 75);
      expect(listener).toHaveBeenNthCalledWith(3, 125);
    });
  });
});
