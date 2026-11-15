import {z} from 'zod';

// Stored as Markdown in static storage (unlimited TEXT equivalent).
export const AboutOptionSchema = z.object({
  about: z.string().refine((value) => value.trim().length > 0),
});
export type AboutOption = z.infer<typeof AboutOptionSchema>;
