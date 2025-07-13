import {TileFontSizes} from '@/constants/sizes.js';

export function getTileFontSize(tileValue: number): string {
  if (tileValue >= 1000) {
    // 5 or 4 digits.
    return TileFontSizes.SMALLER;
  } else if (tileValue >= 100) {
    // 3 or 2 digits.
    return TileFontSizes.SMALL;
  } else {
    return TileFontSizes.NORMAL;
  }
}
