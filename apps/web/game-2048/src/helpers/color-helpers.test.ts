import {describe, expect, it} from 'vitest';

import {TileBackgroundColor, TileTextColor} from '@/constants/colors.js';

import {getTileBackgroundColor, getTileTextColor} from './color-helpers.js';

describe('getTileBackgroundColor', () => {
  it('should return transparent for empty cells (value 0)', () => {
    expect(getTileBackgroundColor(0)).toBe(TileBackgroundColor.TRANSPARENT);
  });

  it('should return correct colors for standard tile values', () => {
    expect(getTileBackgroundColor(2)).toBe(TileBackgroundColor.TILE_2);
    expect(getTileBackgroundColor(4)).toBe(TileBackgroundColor.TILE_4);
    expect(getTileBackgroundColor(8)).toBe(TileBackgroundColor.TILE_8);
    expect(getTileBackgroundColor(16)).toBe(TileBackgroundColor.TILE_16);
    expect(getTileBackgroundColor(32)).toBe(TileBackgroundColor.TILE_32);
    expect(getTileBackgroundColor(64)).toBe(TileBackgroundColor.TILE_64);
    expect(getTileBackgroundColor(128)).toBe(TileBackgroundColor.TILE_128);
    expect(getTileBackgroundColor(256)).toBe(TileBackgroundColor.TILE_256);
    expect(getTileBackgroundColor(512)).toBe(TileBackgroundColor.TILE_512);
    expect(getTileBackgroundColor(1024)).toBe(TileBackgroundColor.TILE_1024);
    expect(getTileBackgroundColor(2048)).toBe(TileBackgroundColor.TILE_2048);
  });

  it('should return dark color for values higher than 2048', () => {
    expect(getTileBackgroundColor(4096)).toBe(
      TileBackgroundColor.TILE_HIGH_VALUE,
    );
    expect(getTileBackgroundColor(8192)).toBe(
      TileBackgroundColor.TILE_HIGH_VALUE,
    );
    expect(getTileBackgroundColor(16384)).toBe(
      TileBackgroundColor.TILE_HIGH_VALUE,
    );
  });

  it('should return fallback color for unknown values', () => {
    expect(getTileBackgroundColor(3)).toBe(TileBackgroundColor.FALLBACK);
    expect(getTileBackgroundColor(5)).toBe(TileBackgroundColor.FALLBACK);
    expect(getTileBackgroundColor(100)).toBe(TileBackgroundColor.FALLBACK);
  });
});

describe('getTileTextColor', () => {
  it('should return transparent for empty cells (value 0)', () => {
    expect(getTileTextColor(0)).toBe(TileTextColor.TRANSPARENT);
  });

  it('should return dark text for light tiles (2, 4)', () => {
    expect(getTileTextColor(2)).toBe(TileTextColor.DARK);
    expect(getTileTextColor(4)).toBe(TileTextColor.DARK);
  });

  it('should return white text for darker tiles', () => {
    expect(getTileTextColor(8)).toBe(TileTextColor.LIGHT);
    expect(getTileTextColor(16)).toBe(TileTextColor.LIGHT);
    expect(getTileTextColor(32)).toBe(TileTextColor.LIGHT);
    expect(getTileTextColor(64)).toBe(TileTextColor.LIGHT);
    expect(getTileTextColor(128)).toBe(TileTextColor.LIGHT);
    expect(getTileTextColor(256)).toBe(TileTextColor.LIGHT);
    expect(getTileTextColor(512)).toBe(TileTextColor.LIGHT);
    expect(getTileTextColor(1024)).toBe(TileTextColor.LIGHT);
    expect(getTileTextColor(2048)).toBe(TileTextColor.LIGHT);
    expect(getTileTextColor(4096)).toBe(TileTextColor.LIGHT);
  });
});
