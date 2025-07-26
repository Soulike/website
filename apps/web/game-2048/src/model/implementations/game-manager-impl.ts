import assert from 'node:assert';
import {EventEmitter} from 'node:events';

import {MoveDirection} from '../constants.js';
import {combineMovements} from '../helpers/movement-helpers.js';
import type {GameChecker} from '../interfaces/game-checker.js';
import type {
  GameManager,
  GameManagerEvents,
} from '../interfaces/game-manager.js';
import type {GridManager} from '../interfaces/grid-manager.js';
import type {GridOperationManager} from '../interfaces/grid-operation-manager.js';
import type {ScoreManager} from '../interfaces/score-manager.js';
import {
  type CompactMovement,
  type MergeMovement,
  type OperationMovements,
} from '../types.js';

export class GameManagerImpl
  extends EventEmitter<GameManagerEvents>
  implements GameManager
{
  private readonly gridManager: GridManager;
  private readonly gridOperationManager: GridOperationManager;
  private readonly gameChecker: GameChecker;
  private readonly scoreManager: ScoreManager;

  constructor(
    gridManager: GridManager,
    gridOperationManager: GridOperationManager,
    gameChecker: GameChecker,
    scoreManager: ScoreManager,
  ) {
    super();
    this.gridManager = gridManager;
    this.gridOperationManager = gridOperationManager;
    this.gameChecker = gameChecker;
    this.scoreManager = scoreManager;
  }

  private get grid() {
    return this.gridManager.getGrid();
  }

  public resetGame() {
    this.gridManager.resetGrid();
    this.scoreManager.resetScore();
    const tileCreations = this.gridOperationManager.createNewTile(2);
    this.emit(
      'gridChange',
      this.grid,
      {mergeMovements: [], compactMovements: []},
      tileCreations,
    );
  }

  public move(direction: MoveDirection): OperationMovements {
    const operationMovements = this.moveWithoutCreatingNewTile(direction);
    if (
      operationMovements.mergeMovements.length > 0 ||
      operationMovements.compactMovements.length > 0
    ) {
      const tileCreations = this.gridOperationManager.createNewTile(1);
      this.emit('gridChange', this.grid, operationMovements, tileCreations);
    }

    if (this.gameChecker.isGameOver()) {
      this.emit('gameOver');
    }

    return operationMovements;
  }

  private moveWithoutCreatingNewTile(direction: MoveDirection) {
    assert(!this.gameChecker.isGameOver(), 'Try to move after game is over.');

    let operationMovements: OperationMovements;

    switch (direction) {
      case MoveDirection.UP:
        operationMovements = this.moveUp();
        break;
      case MoveDirection.DOWN:
        operationMovements = this.moveDown();
        break;
      case MoveDirection.LEFT:
        operationMovements = this.moveLeft();
        break;
      case MoveDirection.RIGHT:
        operationMovements = this.moveRight();
        break;
      default:
        assert.fail(`Unexpected direction ${String(direction)}`);
    }

    const scoreChange = this.getScoreChangeFromMergeMovements(
      operationMovements.mergeMovements,
    );
    this.scoreManager.addToScore(scoreChange);

    return operationMovements;
  }

  private moveUp(): OperationMovements {
    const mergeMovements: MergeMovement[] = [];
    const compactMovements: CompactMovement[] = [];

    for (let col = 0; col < this.grid[0].length; col++) {
      mergeMovements.push(...this.gridOperationManager.mergeCol(col, true));
      compactMovements.push(...this.gridOperationManager.compactCol(col, true));
    }

    return combineMovements({mergeMovements, compactMovements});
  }

  private moveDown(): OperationMovements {
    const mergeMovements: MergeMovement[] = [];
    const compactMovements: CompactMovement[] = [];

    for (let col = 0; col < this.grid[0].length; col++) {
      mergeMovements.push(...this.gridOperationManager.mergeCol(col, false));
      compactMovements.push(
        ...this.gridOperationManager.compactCol(col, false),
      );
    }

    const movements = combineMovements({mergeMovements, compactMovements});
    this.emit('gridChange', this.grid, movements, []);
    return movements;
  }

  private moveLeft(): OperationMovements {
    const mergeMovements: MergeMovement[] = [];
    const compactMovements: CompactMovement[] = [];

    for (let row = 0; row < this.grid.length; row++) {
      mergeMovements.push(...this.gridOperationManager.mergeRow(row, true));
      compactMovements.push(...this.gridOperationManager.compactRow(row, true));
    }

    const movements = combineMovements({mergeMovements, compactMovements});
    this.emit('gridChange', this.grid, movements, []);
    return movements;
  }

  private moveRight(): OperationMovements {
    const mergeMovements: MergeMovement[] = [];
    const compactMovements: CompactMovement[] = [];

    for (let row = 0; row < this.grid.length; row++) {
      mergeMovements.push(...this.gridOperationManager.mergeRow(row, false));
      compactMovements.push(
        ...this.gridOperationManager.compactRow(row, false),
      );
    }

    const movements = combineMovements({mergeMovements, compactMovements});
    this.emit('gridChange', this.grid, movements, []);
    return movements;
  }

  private getScoreChangeFromMergeMovements(
    mergeMovements: readonly MergeMovement[],
  ) {
    let scoreChangeSum = 0;
    for (const {scoreChange} of mergeMovements) {
      scoreChangeSum += scoreChange;
    }
    return scoreChangeSum;
  }
}
