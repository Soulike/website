import * as csr from '../csr';
import {getDocumentOnSSR} from './utils';

export async function ensureDocument() {
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