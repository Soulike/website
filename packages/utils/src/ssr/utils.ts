export async function getDocumentOnSSR(): Promise<Document> {
  const {JSDOM} = await import('jsdom');
  return new JSDOM(``).window.document;
}
