import {z} from 'zod';

import {SessionSchema} from './session.js';

// Plaintext password is hashed to a 128-character SHA-512 hex digest before storage.
export const LoginCredentialsSchema = z.object({
  username: SessionSchema.shape.username,
  password: z.string().min(1),
});
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
