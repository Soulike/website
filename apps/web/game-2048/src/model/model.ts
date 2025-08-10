import {EventEmitter} from 'node:events';

import {MoveDirection} from '@/model/constants.js';

import {GameCheckerImpl} from './implementations/game-checker-impl.js';
import {GameManagerImpl} from './implementations/game-manager-impl.js';
import {GridManagerImpl} from './implementations/grid-manager-impl.js';
import {GridOperationManagerImpl} from './implementations/grid-operation-manager-impl.js';
import {ScoreManagerImpl} from './implementations/score-manager-impl.js';
import type {GameChecker} from './interfaces/game-checker.js';
import type {GameManager} from './interfaces/game-manager.js';
import type {GridManager} from './interfaces/grid-manager.js';
import type {GridOperationManager} from './interfaces/grid-operation-manager.js';
import type {ScoreManager} from './interfaces/score-manager.js';
import type {
  ModelEvents,
  OperationMovements,
  ReadOnlyGridType,
} from './types.js';

export class Model extends EventEmitter<ModelEvents> {
  private readonly gridManager: GridManager;
  private readonly gridOperationManager: GridOperationManager;
  private readonly gameChecker: GameChecker;
  private readonly gameManager: GameManager;
  private readonly scoreManager: ScoreManager;

  constructor() {
    super();
    this.gridManager = new GridManagerImpl();
    this.gridOperationManager = new GridOperationManagerImpl(this.gridManager);
    this.gameChecker = new GameCheckerImpl(this.gridManager);
    this.scoreManager = new ScoreManagerImpl();
    this.gameManager = new GameManagerImpl(
      this.gridManager,
      this.gridOperationManager,
      this.gameChecker,
      this.scoreManager,
    );
    this.relayEvents();
  }

  public resetGame() {
    this.gameManager.resetGame();
  }

  public getGrid(): ReadOnlyGridType {
    return this.gridManager.getGrid();
  }

  public getScore() {
    return this.scoreManager.getScore();
  }

  public getHighestScore() {
    return this.scoreManager.getHighestScore();
  }

  public isGameOver() {
    return this.gameChecker.isGameOver();
  }

  public move(direction: MoveDirection): OperationMovements {
    return this.gameManager.move(direction);
  }

  private relayEvents() {
    this.gameManager.addListener('gameStateChange', (...args) =>
      this.emit('gameStateChange', ...args),
    );
    this.gameManager.addListener('gridChange', (...args) => {
      this.emit('gridChange', ...args);
    });
    this.scoreManager.addListener('scoreChange', (...args) => {
      this.emit('scoreChange', ...args);
    });
    this.scoreManager.addListener('highestScoreChange', (...args) => {
      this.emit('highestScoreChange', ...args);
    });
  }
}
