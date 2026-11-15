import {AccountRowSchema} from '@schema/database';
import {z} from 'zod';

export const SessionSchema = z.object({
  username: AccountRowSchema.shape.username,
});
export type Session = z.infer<typeof SessionSchema>;
