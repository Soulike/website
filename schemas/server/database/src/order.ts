import {z} from 'zod';

export const OrderSchema = z.enum(['ASC', 'DESC']);
export type Order = z.infer<typeof OrderSchema>;

export type OrderConfig<T extends object> = Partial<Record<keyof T, Order>>;
