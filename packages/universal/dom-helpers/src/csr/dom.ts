export function convertHTMLStringToDOM(html: string): DocumentFragment {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
}

export function convertDOMToString(
  dom: DocumentFragment | HTMLElement,
): string {
  const wrapper = document.createElement('div');
  wrapper.append(dom);
  return wrapper.innerHTML;
}
