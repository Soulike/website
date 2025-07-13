/**
 * Returns the background color for a 2048 game tile based on its value
 * @param value The tile value (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, etc.)
 * @returns CSS color string for the tile background
 */
export function getTileBackgroundColor(value: number): string {
  // Empty cells (value 0) are transparent
  if (value === 0) {
    return 'transparent';
  }

  // Color map for 2048 tile values
  const colorMap: Record<number, string> = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  };

  // For known values, return the specific color
  if (value in colorMap) {
    return colorMap[value];
  }

  // For higher values (4096, 8192, etc.), use a dark color
  if (value > 2048) {
    return '#3c3a32';
  }

  // Fallback for any other values
  return '#cdc1b4';
}

/**
 * Returns the text color for a 2048 game tile based on its value
 * @param value The tile value (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, etc.)
 * @returns CSS color string for the tile text
 */
export function getTileTextColor(value: number): string {
  // Empty cells (value 0) have no text
  if (value === 0) {
    return 'transparent';
  }

  // Light tiles (2, 4) use dark text for better contrast
  if (value === 2 || value === 4) {
    return '#776e65';
  }

  // All other tiles use white text for better contrast on darker backgrounds
  return '#f9f6f2';
}
