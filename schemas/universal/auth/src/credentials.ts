import {z} from 'zod';

// Column bounds follow modules/server/database/src/tables/tables.sql ("users").
// Plaintext password is hashed to a 128-character SHA-512 hex digest before storage.
export const LoginCredentialsSchema = z.object({
  username: z.string().trim().min(1).max(255),
  password: z.string().min(1),
});
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
