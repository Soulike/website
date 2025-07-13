import assert from 'node:assert';

import {TileBackgroundColor, TileTextColor} from '@/constants/colors.js';
import {EMPTY_TILE_VALUE} from '@/constants/configs.js';

/**
 * Returns the background color for a 2048 game tile based on its value
 * @param value The tile value (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, etc.)
 * @returns CSS color string for the tile background
 */
export function getTileBackgroundColor(value: number): string {
  // Color map for 2048 tile values
  const colorMap: Record<number, string> = {
    [EMPTY_TILE_VALUE]: TileBackgroundColor.TILE_EMPTY,
    2: TileBackgroundColor.TILE_2,
    4: TileBackgroundColor.TILE_4,
    8: TileBackgroundColor.TILE_8,
    16: TileBackgroundColor.TILE_16,
    32: TileBackgroundColor.TILE_32,
    64: TileBackgroundColor.TILE_64,
    128: TileBackgroundColor.TILE_128,
    256: TileBackgroundColor.TILE_256,
    512: TileBackgroundColor.TILE_512,
    1024: TileBackgroundColor.TILE_1024,
    2048: TileBackgroundColor.TILE_2048,
  };

  // For known values, return the specific color
  if (value in colorMap) {
    return colorMap[value];
  }

  // For higher values (4096, 8192, etc.), use a dark color
  if (value > 2048) {
    return TileBackgroundColor.TILE_HIGHER_VALUE;
  }

  assert.fail('Invalid value for 2048.');
}

/**
 * Returns the text color for a 2048 game tile based on its value
 * @param value The tile value (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, etc.)
 * @returns CSS color string for the tile text
 */
export function getTileTextColor(value: number): string {
  // Empty cells (value 0) have no text
  if (value === EMPTY_TILE_VALUE) {
    return TileTextColor.TRANSPARENT;
  }

  // Light tiles (2, 4) use dark text for better contrast
  if (value === 2 || value === 4) {
    return TileTextColor.DARK;
  }

  // All other tiles use white text for better contrast on darker backgrounds
  return TileTextColor.LIGHT;
}
