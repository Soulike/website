export function isObjectEmpty(object: object) {
  return Reflect.ownKeys(object).length === 0;
}
