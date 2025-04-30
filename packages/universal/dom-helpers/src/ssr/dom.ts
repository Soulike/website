import * as csr from '../csr/index.js';
import {getDocumentOnSSR} from './utils.js';

export async function ensureDocument() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!globalThis.document) {
    globalThis.document = await getDocumentOnSSR();
  }
}

export async function convertHTMLStringToDOM(
  html: string,
): Promise<DocumentFragment> {
  await ensureDocument();
  return csr.convertHTMLStringToDOM(html);
}

export async function convertDOMToString(
  dom: DocumentFragment | HTMLElement,
): Promise<string> {
  await ensureDocument();
  return csr.convertDOMToString(dom);
}
