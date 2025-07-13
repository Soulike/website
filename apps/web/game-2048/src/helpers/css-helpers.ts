export function getCSSVariable(
  element: HTMLElement,
  variableName: string,
): string {
  return getComputedStyle(element).getPropertyValue(variableName).trim();
}

export function getCSSVariableOnRootElement(variableName: string): string {
  return getCSSVariable(document.documentElement, variableName);
}
