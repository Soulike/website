import type {EventEmitter} from 'node:events';

import {MoveDirection} from '../constants.js';
import type {
  OperationMovements,
  ReadOnlyGridType,
  TileCreation,
} from '../types.js';

export interface GameManager extends EventEmitter<GameManagerEvents> {
  resetGame(): void;
  move(direction: MoveDirection): OperationMovements;
}

export type GridChangeEventListener = (
  grid: ReadOnlyGridType,
  movements: Readonly<OperationMovements>,
  creations: readonly Readonly<TileCreation>[],
) => void;

export type GameOverEventListener = () => void;

export interface GameManagerEvents {
  gridChange: Parameters<GridChangeEventListener>;
  gameOver: Parameters<GameOverEventListener>;
}
