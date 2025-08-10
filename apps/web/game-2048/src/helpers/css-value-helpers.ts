/**
 * Calculates the computed CSS value by creating a temporary DOM element
 * @param cssValue - The CSS value to compute (e.g., "min(2vw, 2vh, 10px)")
 * @param property - The CSS property to apply the value to
 * @returns The computed value in pixels
 * @example
 * // Calculate responsive gap value
 * const gap = calculateCSSValue('min(2vw, 2vh, 10px)', 'width');
 *
 * @example
 * // Calculate font size with clamp
 * const fontSize = calculateCSSValue('clamp(12px, 4vw, 24px)', 'font-size');
 */
export function calculateCSSValue(cssValue: string, property: string): number {
  const tempElement = document.createElement('div');
  tempElement.style.setProperty(property, cssValue);
  tempElement.style.position = 'absolute';
  tempElement.style.visibility = 'hidden';
  document.body.appendChild(tempElement);

  const computedStyle = getComputedStyle(tempElement);
  const computedValue = parseFloat(computedStyle.getPropertyValue(property));
  document.body.removeChild(tempElement);

  if (Number.isNaN(computedValue)) {
    throw new Error(
      `Failed to calculate CSS value: '${cssValue}' for property '${property}'.`,
    );
  }

  return computedValue;
}
