/**
 * Checks if a number is a power of 2 (including 0)
 * @param value - The number to check
 * @returns true if the value is a power of 2, false otherwise
 */
export function isPowerOfTwo(value: number): boolean {
  // Handle special case for 0 (considered as 2^(-∞))
  if (value === 0) {
    return true;
  }

  // Handle negative numbers and non-integers
  if (value < 0 || !Number.isInteger(value)) {
    return false;
  }

  // Use bitwise operation: a power of 2 has only one bit set
  // So n & (n-1) should be 0 for powers of 2
  return (value & (value - 1)) === 0;
}

export function isValid2048Value(value: number): boolean {
  if (value === 1) {
    return false;
  }
  return isPowerOfTwo(value);
}
