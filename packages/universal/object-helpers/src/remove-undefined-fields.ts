export function removeUndefinedFieldsShallow<T extends Record<string, unknown>>(
  object: T,
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in object) {
    if (Object.hasOwn(object, key) && object[key] !== undefined) {
      result[key] = object[key];
    }
  }
  return result;
}
