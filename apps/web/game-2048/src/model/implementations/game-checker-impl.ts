import type {GameChecker} from '../interfaces/game-checker.js';
import type {GridManager} from '../interfaces/grid-manager.js';

export class GameCheckerImpl implements GameChecker {
  private readonly gridManager: GridManager;

  constructor(gridManager: GridManager) {
    this.gridManager = gridManager;
  }

  private get grid() {
    return this.gridManager.getGrid();
  }

  private get emptyTileCount() {
    return this.gridManager.getEmptyTileCount();
  }

  public isGameOver(): boolean {
    if (this.emptyTileCount > 0) {
      return false;
    }

    // Check if any adjacent tiles can be merged
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        const tileValue = this.grid[row][col];

        // Check right neighbor
        if (
          col < this.grid[0].length - 1 &&
          this.grid[row][col + 1] === tileValue
        ) {
          return false;
        }

        // Check bottom neighbor
        if (
          row < this.grid.length - 1 &&
          this.grid[row + 1][col] === tileValue
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
