import {z} from 'zod';

// Column bounds follow modules/server/database/src/tables/tables.sql ("users").
export const AccountRowSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(255)
    .refine((value) => value === value.trim()),
  password: z.string().min(1).max(255),
});
export type AccountRow = z.infer<typeof AccountRowSchema>;

export const AccountInsertRowSchema = AccountRowSchema;
export type AccountInsertRow = z.infer<typeof AccountInsertRowSchema>;

export const AccountUpdateRowSchema = AccountRowSchema.omit({
  username: true,
}).partial();
export type AccountUpdateRow = z.infer<typeof AccountUpdateRowSchema>;
