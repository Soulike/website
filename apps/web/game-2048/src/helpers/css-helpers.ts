export function setCSSVariableValue(
  element: HTMLElement,
  variableName: string,
  value: string,
) {
  element.style.setProperty(variableName, value);
}

export function getCSSVariableValueExpression(variableName: string): string {
  return `var(${variableName})`;
}
