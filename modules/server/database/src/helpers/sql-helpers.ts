import assert from 'node:assert';

import {removeUndefinedFieldsShallow} from '@library/object-helpers';
import {ValueType} from '@library/ts-type-helpers';

import {OrderConfig} from '@/types.js';

/**
 * Generates an SQL ORDER BY statement from an OrderConfig object.
 *
 * @param {OrderConfig<T>} orderConfig - Configuration object specifying field names and sort directions
 * @returns {string} The SQL ORDER BY statement
 *
 * @example
 * // Generate an ORDER BY statement for sorting by name ascending and age descending
 * const orderStatement = generateOrderByClause({ name: 'ASC', age: 'DESC' });
 * // Result: 'ORDER BY "name" ASC, "age" DESC'
 */
export function generateOrderByClause<T extends object>(
  orderConfig: OrderConfig<T>,
): string {
  if (Object.keys(orderConfig).length === 0) {
    return '';
  }

  const orderParts = Object.entries<ValueType<OrderConfig<T>>>(orderConfig).map(
    ([column, direction]) => {
      assert(direction);
      return `"${column}" ${direction}`;
    },
  );

  return `ORDER BY ${orderParts.join(', ')}`;
}

/**
 * Generates a parameterized SQL WHERE clause from an object of field-value pairs.
 *
 * @param {Record<string, unknown>} whereConfig - Object where keys are field names and values are the values to match
 * @param {'AND' | 'OR'} operator - The logical operator to use between conditions (default: 'AND')
 * @returns {{ whereClause: string; values: unknown[] }} Object containing the WHERE clause text and values array
 *
 * @example
 * // Generate a WHERE clause with AND operator
 * const { whereClause, values } = generateWhereClause({ name: 'John', active: true });
 * // Result: whereClause = 'WHERE "name" = $1 AND "active" = $2', values = ['John', true]
 *
 * @example
 * // Generate a WHERE clause with OR operator
 * const { whereClause, values } = generateWhereClause({ name: 'John', email: 'john@example.com' }, 'OR');
 * // Result: whereClause = 'WHERE "name" = $1 OR "email" = $2', values = ['John', 'john@example.com']
 */
export function generateWhereClause(
  whereConfig: Record<string, unknown>,
  operator: 'AND' | 'OR' = 'AND',
): {whereClause: string; values: unknown[]} {
  const filteredConfig = removeUndefinedFieldsShallow(whereConfig);

  if (Object.keys(filteredConfig).length === 0) {
    return {whereClause: '', values: []};
  }

  const values: unknown[] = [];
  const conditions = Object.entries(filteredConfig).map(
    ([field, value], index) => {
      values.push(value);
      return `"${field}" = $${(index + 1).toString()}`;
    },
  );

  return {
    whereClause: `WHERE ${conditions.join(` ${operator} `)}`,
    values,
  };
}

/**
 * Generates a parameterized SQL SET clause from an object of field-value pairs.
 *
 * @param {Record<string, unknown>} setConfig - Object where keys are field names and values are the new values to set
 * @returns {{ setClause: string; values: unknown[] }} Object containing the SET clause text and values array
 *
 * @example
 * // Generate a SET clause
 * const { setClause, values } = generateSetClause({ name: 'John', active: true });
 * // Result: setClause = 'SET "name" = $1, "active" = $2', values = ['John', true]
 */
export function generateSetClause(setConfig: Record<string, unknown>): {
  setClause: string;
  values: unknown[];
} {
  const filteredConfig = removeUndefinedFieldsShallow(setConfig);

  if (Object.keys(filteredConfig).length === 0) {
    return {setClause: '', values: []};
  }

  const values: unknown[] = [];
  const setStatements = Object.entries(filteredConfig).map(
    ([field, value], index) => {
      values.push(value);
      return `"${field}" = $${(index + 1).toString()}`;
    },
  );

  return {
    setClause: `SET ${setStatements.join(', ')}`,
    values,
  };
}

/**
 * Generates a parameterized SQL INSERT statement from a table name and an object of field-value pairs.
 *
 * @param {string} tableName - The name of the table to insert into
 * @param {Record<string, unknown>} insertConfig - Object where keys are field names and values are the values to insert
 * @returns {{ insertStatement: string; values: unknown[] }} Object containing the INSERT statement text and values array
 *
 * @example
 * // Generate an INSERT statement
 * const { insertStatement, values } = generateInsertStatement('users', { name: 'John', active: true });
 * // Result: insertStatement = 'INSERT INTO "users" ("name", "active") VALUES ($1, $2)', values = ['John', true]
 */
export function generateInsertStatement(
  tableName: string,
  insertConfig: Record<string, unknown>,
): {
  insertStatement: string;
  values: unknown[];
} {
  const filteredConfig = removeUndefinedFieldsShallow(insertConfig);

  if (Object.keys(filteredConfig).length === 0) {
    return {insertStatement: '', values: []};
  }

  const values: unknown[] = [];
  const columns = Object.keys(filteredConfig).map((field) => `"${field}"`);
  const placeholders = Object.values(filteredConfig).map((value, index) => {
    values.push(value);
    return `$${(index + 1).toString()}`;
  });

  return {
    insertStatement: `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`,
    values,
  };
}
