export function createInPlaceCloneElement<T extends HTMLElement>(
  element: T,
): T {
  const rect = element.getBoundingClientRect();
  const clone = element.cloneNode(true) as T;
  Object.assign(clone.style, {
    position: 'fixed',
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
