export async function getDocumentOnSSR(): Promise<Document> {
  const {JSDOM} = await import('jsdom');
  return new JSDOM(``, {runScripts: 'dangerously', resources: 'usable'}).window
    .document;
}
