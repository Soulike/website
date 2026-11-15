import * as csr from '../csr/index.js';
import {getDocumentOnSSR} from './utils.js';

export async function ensureDocument() {
  if (typeof globalThis.document === 'undefined') {
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
