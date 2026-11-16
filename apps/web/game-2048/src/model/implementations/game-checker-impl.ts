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
    const rowCount = this.grid.length;
    const colCount = this.grid[0]?.length ?? 0;
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        const tileValue = this.gridManager.getTileValue({row, col});

        // Check right neighbor
        if (
          col < colCount - 1 &&
          this.gridManager.getTileValue({row, col: col + 1}) === tileValue
        ) {
          return false;
        }

        // Check bottom neighbor
        if (
          row < rowCount - 1 &&
          this.gridManager.getTileValue({row: row + 1, col}) === tileValue
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
