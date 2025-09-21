import {z} from 'zod';

export class UserInfo implements z.infer<typeof UserInfo.schema> {
  private static readonly schema = z.object({
    username: z.string(),
  });

  public username: string;

  constructor(username: string) {
    this.username = username;
  }

  static validate(value: unknown): value is z.infer<typeof UserInfo.schema> {
    const result = UserInfo.schema.safeParse(value);
    return result.success;
  }

  static from(obj: z.infer<typeof UserInfo.schema>): UserInfo {
    return new UserInfo(obj.username);
  }
}
