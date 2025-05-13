/**
 * Represents the possible directions for SQL ORDER BY statements.
 * - 'ASC': Ascending order (smallest to largest, A to Z)
 * - 'DESC': Descending order (largest to smallest, Z to A)
 */
export type Order = 'ASC' | 'DESC';

/**
 * Configuration object for SQL ORDER BY clauses.
 *
 * This type maps entity properties to their sort direction ('ASC' or 'DESC').
 * It ensures that only valid property names from the entity type T can be used as sort fields.
 *
 * @template T - The entity type whose properties can be used for sorting
 *
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   createdAt: Date;
 * }
 *
 * // Sort by name ascending and created date descending
 * const orderConfig: OrderConfig<User> = {
 *   name: 'ASC',
 *   createdAt: 'DESC'
 * };
 * ```
 */
export type OrderConfig<T extends object> = Partial<Record<keyof T, Order>>;
