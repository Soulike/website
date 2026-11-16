export function createInPlaceCloneElement(element: HTMLElement): HTMLElement {
  const rect = element.getBoundingClientRect();
  const clone = element.cloneNode(true);
  if (!(clone instanceof HTMLElement)) {
    throw new TypeError('Expected cloned node to be an HTMLElement');
  }
  Object.assign(clone.style, {
    position: 'absolute',
    left: `${(rect.left + window.scrollX).toString()}px`,
    top: `${(rect.top + window.scrollY).toString()}px`,
    width: `${rect.width.toString()}px`,
    height: `${rect.height.toString()}px`,
    pointerEvents: 'none',
    margin: '0',
    boxSizing: 'border-box',
  });
  return clone;
}
