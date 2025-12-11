import {describe, expect, it} from 'vitest';

import {OrderConfig} from '../types.js';
import {
  generateInsertStatement,
  generateOrderByClause,
  generateSetClause,
  generateWhereClause,
} from './sql-helpers.js';

describe('generateOrderByClause', () => {
  // Basic functionality tests
  it('should generate a simple ORDER BY clause with ascending sort', () => {
    const result = generateOrderByClause({name: 'ASC'});
    expect(result).toBe('ORDER BY "name" ASC');
  });

  it('should generate a simple ORDER BY clause with descending sort', () => {
    const result = generateOrderByClause({createdAt: 'DESC'});
    expect(result).toBe('ORDER BY "createdAt" DESC');
  });

  // Multiple column tests
  it('should handle multiple columns with mixed sort directions', () => {
    const result = generateOrderByClause({
      lastName: 'ASC',
      firstName: 'ASC',
      age: 'DESC',
    });
    expect(result).toBe('ORDER BY "lastName" ASC, "firstName" ASC, "age" DESC');
  });

  // Edge cases
  it('should return an empty string for empty objects', () => {
    const result = generateOrderByClause({});
    expect(result).toBe('');
  });

  it('should handle property names with special characters', () => {
    const result = generateOrderByClause({
      'user-name': 'ASC',
      'creation.date': 'DESC',
    });
    expect(result).toBe('ORDER BY "user-name" ASC, "creation.date" DESC');
  });

  // Type safety test - this is more for TypeScript validation
  it('should work with typed objects', () => {
    interface User {
      id: number;
      name: string;
      createdAt: Date;
    }

    const orderConfig: OrderConfig<User> = {
      name: 'ASC',
      createdAt: 'DESC',
    };

    const result = generateOrderByClause(orderConfig);
    expect(result).toBe('ORDER BY "name" ASC, "createdAt" DESC');
  });
});

describe('generateWhereClause', () => {
  // Basic functionality tests
  it('should generate a simple WHERE clause with AND operator (default)', () => {
    const {whereClause, values} = generateWhereClause({name: 'John'});
    expect(whereClause).toBe('WHERE "name" = $1');
    expect(values).toEqual(['John']);
  });

  it('should generate a WHERE clause with OR operator', () => {
    const {whereClause, values} = generateWhereClause(
      {name: 'John', email: 'john@example.com'},
      'OR',
    );
    expect(whereClause).toBe('WHERE "name" = $1 OR "email" = $2');
    expect(values).toEqual(['John', 'john@example.com']);
  });

  it('should handle multiple conditions with AND operator', () => {
    const {whereClause, values} = generateWhereClause({
      firstName: 'John',
      lastName: 'Doe',
      active: true,
    });
    expect(whereClause).toBe(
      'WHERE "firstName" = $1 AND "lastName" = $2 AND "active" = $3',
    );
    expect(values).toEqual(['John', 'Doe', true]);
  });

  // Edge cases
  it('should return empty strings for empty objects', () => {
    const {whereClause, values} = generateWhereClause({});
    expect(whereClause).toBe('');
    expect(values).toEqual([]);
  });

  it('should filter out undefined values', () => {
    const {whereClause, values} = generateWhereClause({
      name: 'John',
      age: undefined,
      active: true,
    });
    expect(whereClause).toBe('WHERE "name" = $1 AND "active" = $2');
    expect(values).toEqual(['John', true]);
  });

  it('should handle different value types', () => {
    const now = new Date();
    const {whereClause, values} = generateWhereClause({
      id: 123,
      name: 'John',
      active: true,
      score: 42.5,
      createdAt: now,
      tags: ['tag1', 'tag2'],
    });
    expect(whereClause).toBe(
      'WHERE "id" = $1 AND "name" = $2 AND "active" = $3 AND "score" = $4 AND "createdAt" = $5 AND "tags" = $6',
    );
    expect(values).toEqual([123, 'John', true, 42.5, now, ['tag1', 'tag2']]);
  });
});

describe('generateSetClause', () => {
  // Basic functionality tests
  it('should generate a simple SET clause with one field', () => {
    const {setClause, values} = generateSetClause({name: 'John'});
    expect(setClause).toBe('SET "name" = $1');
    expect(values).toEqual(['John']);
  });

  it('should handle multiple fields', () => {
    const {setClause, values} = generateSetClause({
      firstName: 'John',
      lastName: 'Doe',
      active: true,
    });
    expect(setClause).toBe(
      'SET "firstName" = $1, "lastName" = $2, "active" = $3',
    );
    expect(values).toEqual(['John', 'Doe', true]);
  });

  // Edge cases
  it('should return empty strings for empty objects', () => {
    const {setClause, values} = generateSetClause({});
    expect(setClause).toBe('');
    expect(values).toEqual([]);
  });

  it('should filter out undefined values', () => {
    const {setClause, values} = generateSetClause({
      name: 'John',
      age: undefined,
      active: true,
    });
    expect(setClause).toBe('SET "name" = $1, "active" = $2');
    expect(values).toEqual(['John', true]);
  });

  it('should handle different value types', () => {
    const now = new Date();
    const {setClause, values} = generateSetClause({
      id: 123,
      name: 'John',
      active: true,
      score: 42.5,
      updatedAt: now,
      tags: ['tag1', 'tag2'],
    });
    expect(setClause).toBe(
      'SET "id" = $1, "name" = $2, "active" = $3, "score" = $4, "updatedAt" = $5, "tags" = $6',
    );
    expect(values).toEqual([123, 'John', true, 42.5, now, ['tag1', 'tag2']]);
  });
});

describe('generateInsertStatement', () => {
  // Basic functionality tests
  it('should generate a simple INSERT statement with one field', () => {
    const {insertStatement, values} = generateInsertStatement('users', {
      name: 'John',
    });
    expect(insertStatement).toBe('INSERT INTO "users" ("name") VALUES ($1)');
    expect(values).toEqual(['John']);
  });

  it('should handle multiple fields', () => {
    const {insertStatement, values} = generateInsertStatement('users', {
      firstName: 'John',
      lastName: 'Doe',
      active: true,
    });
    expect(insertStatement).toBe(
      'INSERT INTO "users" ("firstName", "lastName", "active") VALUES ($1, $2, $3)',
    );
    expect(values).toEqual(['John', 'Doe', true]);
  });

  // Edge cases
  it('should return empty strings for empty objects', () => {
    const {insertStatement, values} = generateInsertStatement('users', {});
    expect(insertStatement).toBe('');
    expect(values).toEqual([]);
  });

  it('should filter out undefined values', () => {
    const {insertStatement, values} = generateInsertStatement('users', {
      name: 'John',
      age: undefined,
      active: true,
    });
    expect(insertStatement).toBe(
      'INSERT INTO "users" ("name", "active") VALUES ($1, $2)',
    );
    expect(values).toEqual(['John', true]);
  });

  it('should handle different value types', () => {
    const now = new Date();
    const {insertStatement, values} = generateInsertStatement('users', {
      id: 123,
      name: 'John',
      active: true,
      score: 42.5,
      createdAt: now,
      tags: ['tag1', 'tag2'],
    });
    expect(insertStatement).toBe(
      'INSERT INTO "users" ("id", "name", "active", "score", "createdAt", "tags") VALUES ($1, $2, $3, $4, $5, $6)',
    );
    expect(values).toEqual([123, 'John', true, 42.5, now, ['tag1', 'tag2']]);
  });

  it('should properly escape table and column names', () => {
    const {insertStatement, values} = generateInsertStatement('user-table', {
      'first-name': 'Jane',
      'email.address': 'jane@example.com',
    });
    expect(insertStatement).toBe(
      'INSERT INTO "user-table" ("first-name", "email.address") VALUES ($1, $2)',
    );
    expect(values).toEqual(['Jane', 'jane@example.com']);
  });
});
