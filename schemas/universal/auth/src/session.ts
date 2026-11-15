import {z} from 'zod';

// Column bounds follow modules/server/database/src/tables/tables.sql ("users").
export const SessionSchema = z.object({
  username: z.string().trim().min(1).max(255),
});
export type Session = z.infer<typeof SessionSchema>;
