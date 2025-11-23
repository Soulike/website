import assert from 'node:assert';

/**
 * Asserts that the current environment is a test environment.
 * Should be used to guard testing-only methods and functionality.
 * @param methodName - Name of the method being called (for error message)
 */
export function assertIsTest(methodName: string): void {
  assert(
    process.env.NODE_ENV === 'test' || process.env.VITEST === 'true',
    `${methodName} should only be called in testing environment`,
  );
}
