import {z} from 'zod';

export class User implements z.infer<typeof User.schema> {
  private static readonly schema = z.object({
    username: z.string(),
    password: z.string(),
  });

  public username: string;
  public password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  static from(obj: unknown): User {
    if (!User.validate(obj)) {
      throw new Error('Invalid User');
    }
    return new User(obj.username, obj.password);
  }

  static validate(value: unknown): value is z.infer<typeof User.schema> {
    const result = User.schema.safeParse(value);
    return result.success;
  }
}
