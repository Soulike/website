export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (...args: never[]) => unknown
    ? T[P]
    : T[P] extends object
      ? DeepReadonly<T[P]>
      : T[P];
};

export function deepFreeze<T extends object>(obj: T): DeepReadonly<T> {
  Object.freeze(obj);
  Reflect.ownKeys(obj).forEach((key) => {
    const value: unknown = Reflect.get(obj, key);

    if (
      value !== null &&
      typeof value === 'object' &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });

  return obj;
}
