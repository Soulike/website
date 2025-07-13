export function getCSSVariableValue(
  element: HTMLElement,
  variableName: string,
): string {
  return getComputedStyle(element).getPropertyValue(variableName).trim();
}

export function getCSSVariableValueOnRootElement(variableName: string): string {
  return getCSSVariableValue(document.documentElement, variableName);
}
