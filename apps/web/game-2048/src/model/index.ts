export {MoveDirection} from './constants.js';
export type {
  GameOverEventListener,
  GridChangeEventListener,
} from './interfaces/game-manager.js';
export type {ScoreChangeEventListener} from './interfaces/score-manager.js';
export * from './types.js';

const {Model} = await import('./model.js');
const model = new Model();
export {model};
