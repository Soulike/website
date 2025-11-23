/**
 * Generate formatted string based on template.
 * @param template - Template containing placeholders
 * @param placeholderMark - The placeholder marker to use
 * @param args - Args replace placeholders
 * @throws Error - Throws error if the number of args does not match with template.
 */
export function format(
  template: string,
  placeholderMark: string,
  ...args: string[]
): string {
  const templateParts = template.split(placeholderMark);
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
