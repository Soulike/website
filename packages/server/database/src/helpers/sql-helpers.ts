import {removeUndefinedFieldsShallow} from '@website/object-helpers';

/**
 * Generates SQL parameters and a parameterized statement from an object.
 *
 * @param {Record<string, unknown>} object - The object containing field-value pairs for SQL parameters
 * @param {'AND' | ','} connector - The SQL connector to use between parameters ('AND' for WHERE clauses, ',' for INSERT/UPDATE statements)
 * @returns {{
 *   parameters: unknown[];
 *   parameterizedStatement: string;
 * }} Object containing the parameter values array and the parameterized SQL statement
 *
 * @example
 * // For WHERE clauses
 * const { parameters, parameterizedStatement } = generateSqlParameters({ id: 1, active: true }, 'AND');
 * // Result: parameters = [1, true], parameterizedStatement = '"id"=$1 AND "active"=$2'
 *
 * @example
 * // For INSERT/UPDATE statements
 * const { parameters, parameterizedStatement } = generateSqlParameters({ name: 'John', age: 30 }, ',');
 * // Result: parameters = ['John', 30], parameterizedStatement = '"name"=$1 , "age"=$2'
 */
export function generateSqlParameters(
  object: Record<string, unknown>,
  connector: 'AND' | ',',
): {
  parameters: unknown[];
  parameterizedStatement: string;
} {
  object = removeUndefinedFieldsShallow(object);
  const parameters: unknown[] = [];
  const statementParts: string[] = [];

  Object.keys(object).forEach((key, index) => {
    statementParts.push(`"${key}"=$${(index + 1).toString()}`);
    parameters.push(object[key]);
  });

  return {
    parameters,
    parameterizedStatement: statementParts.join(` ${connector} `),
  };
}
