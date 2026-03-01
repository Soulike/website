import {z} from 'zod';

export class Session implements z.infer<typeof Session.schema> {
  private static readonly schema = z.object({
    username: z.string(),
  });

  public username: string;

  constructor(username: string) {
    this.username = username;
  }

  static validate(value: unknown): value is z.infer<typeof Session.schema> {
    const result = Session.schema.safeParse(value);
    return result.success;
  }

  static from(obj: z.infer<typeof Session.schema>): Session {
    return new Session(obj.username);
  }
}
