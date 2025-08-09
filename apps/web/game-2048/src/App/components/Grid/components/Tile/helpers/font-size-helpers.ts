import {TileFontSize} from '@/constants/tile-font-size.js';

export function getTileFontSize(tileValue: number): TileFontSize {
  if (tileValue >= 1000) {
    // 5 or 4 digits.
    return TileFontSize.SMALLER;
  } else if (tileValue >= 100) {
    // 3 or 2 digits.
    return TileFontSize.SMALL;
  } else {
    return TileFontSize.NORMAL;
  }
}
