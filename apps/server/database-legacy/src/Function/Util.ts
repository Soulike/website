import cloneDeep from 'clone-deep';

export function generateRandomString(length = 11): string {
  if (length <= 0) {
    throw new Error('The length of the string must be positive');
  }
  const charArray: string[] = [];
  const generateTime = Math.floor(length / 5);
  for (let i = 0; i < generateTime; i++) {
    charArray.push(...Math.random().toString(32).slice(-5));
  }
  const rearLength = length - 5 * generateTime;
  charArray.push(
    ...Math.random()
      .toString(32)
      .slice(2, 2 + rearLength),
  );
  return charArray.join('');
}

export function removeUndefinedValuesFromObject(
  object: Record<string, any>,
): Record<string, any> {
  const {parse, stringify} = JSON;
  return parse(stringify(object));
}

/**
 * 递归转换对象中存在的 Buffer 经过 JSON 转换的产物
 * */
export function recoverBuffersTransformedByJSONInObject(
  object: Record<string, any>,
): Record<string, any> {
  const objectWithRecoveredBuffers = cloneDeep(object);
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'object') {
      if (object[key].type === 'Buffer' && Array.isArray(object[key].data)) {
        objectWithRecoveredBuffers[key] = Buffer.from(object[key]);
      } else {
        objectWithRecoveredBuffers[key] =
          recoverBuffersTransformedByJSONInObject(object[key]);
      }
    }
  });
  return objectWithRecoveredBuffers;
}
