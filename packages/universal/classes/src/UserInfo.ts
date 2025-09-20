import {z} from 'zod';

export class UserInfo {
  public username: string;

  constructor(username: string) {
    this.username = username;
  }

  private static readonly schema = z.object({
    username: z.string(),
  });

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
