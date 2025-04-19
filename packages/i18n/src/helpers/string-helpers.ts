import {PLACEHOLDER_MARK} from '../constants.js';

/**
 * Generate formatted string based on template.
 * @param template - Template containing placeholders. The placeholder is `{}`.
 * @param args - Args replace placeholders
 * @throws Error - Throws error if the number of args does not match with template.
 */
export function format(template: string, ...args: string[]): string {
  const templateParts = template.split(PLACEHOLDER_MARK);
  const placeholderNumber = templateParts.length - 1;
  if (placeholderNumber !== args.length) {
    throw new Error('The numbers of placeholders and args do not match');
  }

  const resultParts: string[] = [];
  for (let i = 0; i < args.length; i++) {
    resultParts.push(templateParts[i], args[i]);
  }
  resultParts.push(templateParts[templateParts.length - 1]);
  return resultParts.join('');
}
