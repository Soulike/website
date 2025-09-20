import {z} from 'zod';

export class UserInfo implements z.infer<typeof UserInfo.schema> {
  private static readonly schema = z.object({
    username: z.string(),
  });

  public username: string;

  constructor(username: string) {
    this.username = username;
  }

  static validate(value: unknown): value is UserInfo {
    const result = UserInfo.schema.safeParse(value);
    return result.success;
  }

  static from(obj: unknown): UserInfo {
    if (!UserInfo.validate(obj)) {
      throw new Error('Invalid UserInfo');
    }
    return new UserInfo(obj.username);
  }
}
