import {describe, expect, it, type Mock, vi} from 'vitest';

import {GRID_SIDE_LENGTH} from '@/constants/configs.js';
import type {GridChangeEventListener} from '@/model/index.js';
import {GameState} from '@/model/interfaces/game-manager.js';

import {MoveDirection} from '../constants.js';
import {GameCheckerImpl} from './game-checker-impl.js';
import {GameManagerImpl} from './game-manager-impl.js';
import {GridManagerImpl} from './grid-manager-impl.js';
import {GridOperationManagerImpl} from './grid-operation-manager-impl.js';
import {ScoreManagerImpl} from './score-manager-impl.js';

describe('GameManagerImpl', () => {
  const createManagers = () => {
    const gridManager = new GridManagerImpl();
    const gridOperationManager = new GridOperationManagerImpl(gridManager);
    const gameChecker = new GameCheckerImpl(gridManager);
    const scoreManager = new ScoreManagerImpl();

    return {
      gameManager: new GameManagerImpl(
        gridManager,
        gridOperationManager,
        gameChecker,
        scoreManager,
      ),
      gridManager,
      scoreManager,
    };
  };

  describe('resetGame', () => {
    it('should reset grid and score, create 2 new tiles, and emit gridChange', () => {
      const {gameManager, gridManager} = createManagers();
      const gridChangeListener: Mock<GridChangeEventListener> = vi.fn();

      gameManager.on('gridChange', gridChangeListener);
      gameManager.resetGame();

      expect(gridManager.getEmptyTileCount()).toEqual(
        GRID_SIDE_LENGTH * GRID_SIDE_LENGTH - 2,
      );

      const [, , tileCreations] = gridChangeListener.mock.calls[0];
      expect(tileCreations).toHaveLength(2);
    });
  });

  describe('move', () => {
    it('should handle move left with merges and compactions', () => {
      const {gameManager, gridManager} = createManagers();

      // Set up a grid with mergeable tiles
      gridManager.setGridStateForTesting([
        [0, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      const movements = gameManager.moveWithoutCreatingNewTileForTesting(
        MoveDirection.LEFT,
      );

      expect(movements.mergeMovements).toHaveLength(1);
      expect(movements.mergeMovements[0].scoreChange).toBe(4);
      expect(movements.compactMovements).toHaveLength(2);
      expect(gridManager.getGrid()[0]).toStrictEqual([4, 2, 0, 0]);
    });

    it('should handle move right', () => {
      const {gameManager, gridManager} = createManagers();

      // Set up a grid with mergeable tiles
      gridManager.setGridStateForTesting([
        [2, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      const movements = gameManager.moveWithoutCreatingNewTileForTesting(
        MoveDirection.RIGHT,
      );

      expect(movements.mergeMovements).toHaveLength(1);
      expect(movements.mergeMovements[0].scoreChange).toBe(4);
      expect(movements.compactMovements).toHaveLength(2);
      expect(gridManager.getGrid()[0]).toStrictEqual([0, 0, 2, 4]);
    });

    it('should handle move up', () => {
      const {gameManager, gridManager} = createManagers();

      // Set up a grid with mergeable tiles
      gridManager.setGridStateForTesting([
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
      ]);

      const movements = gameManager.moveWithoutCreatingNewTileForTesting(
        MoveDirection.UP,
      );

      expect(movements.mergeMovements).toHaveLength(1);
      expect(movements.mergeMovements[0].scoreChange).toBe(4);
      expect(movements.compactMovements).toHaveLength(2);
      expect(gridManager.getGrid().map((row) => row[0])).toStrictEqual([
        4, 2, 0, 0,
      ]);
    });

    it('should handle move down', () => {
      const {gameManager, gridManager} = createManagers();

      // Set up a grid with mergeable tiles
      gridManager.setGridStateForTesting([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      const movements = gameManager.moveWithoutCreatingNewTileForTesting(
        MoveDirection.DOWN,
      );

      expect(movements.mergeMovements).toHaveLength(1);
      expect(movements.mergeMovements[0].scoreChange).toBe(4);
      expect(movements.compactMovements).toHaveLength(2);
      expect(gridManager.getGrid().map((row) => row[0])).toStrictEqual([
        0, 0, 2, 4,
      ]);
    });

    it('should create new tile after successful move', () => {
      const {gameManager, gridManager} = createManagers();
      const gridChangeListener = vi.fn<GridChangeEventListener>();

      gridManager.setGridStateForTesting([
        [2, 0, 4, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      gameManager.on('gridChange', gridChangeListener);
      gameManager.move(MoveDirection.LEFT);

      expect(gridChangeListener).toHaveBeenCalledTimes(1);
      const [, , tileCreations] = gridChangeListener.mock.calls[0];
      expect(tileCreations).toHaveLength(1);
    });

    it('should not create new tile when no movement occurs', () => {
      const {gameManager, gridManager} = createManagers();
      const gridChangeListener = vi.fn<GridChangeEventListener>();

      gridManager.setGridStateForTesting([
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      gameManager.on('gridChange', gridChangeListener);
      const movements = gameManager.move(MoveDirection.LEFT);

      expect(movements.mergeMovements).toHaveLength(0);
      expect(movements.compactMovements).toHaveLength(0);
      expect(gridChangeListener).not.toHaveBeenCalled();
    });

    it('should emit gameStateChange', () => {
      const {gameManager, gridManager} = createManagers();
      const gameStateChangeListener = vi.fn();

      // Set up a game over state but with one move possible
      gridManager.setGridStateForTesting([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 32],
        [4, 2, 0, 16],
      ]);

      gameManager.on('gameStateChange', gameStateChangeListener);

      // This move should trigger game state check
      gameManager.move(MoveDirection.LEFT);

      expect(gameStateChangeListener).toHaveBeenCalledWith(
        GameState.NEED_RESTART,
      );

      gameManager.resetGame();
      expect(gameStateChangeListener).toHaveBeenCalledWith(GameState.NORMAL);
    });

    it('should throw when trying to move after game is over', () => {
      const {gameManager, gridManager} = createManagers();

      // Set up a complete game over state
      gridManager.setGridStateForTesting([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]);

      expect(() => gameManager.move(MoveDirection.LEFT)).toThrow();
    });
  });

  describe('score management integration', () => {
    it('should update score based on merge movements', () => {
      const {gameManager, gridManager, scoreManager} = createManagers();

      gridManager.setGridStateForTesting([
        [2, 2, 4, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      gameManager.move(MoveDirection.LEFT);

      // Score should be 4 (from 2+2) + 8 (from 4+4) = 12
      expect(scoreManager.getScore()).toBe(12);
    });
  });
});
