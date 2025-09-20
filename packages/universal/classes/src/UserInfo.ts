export class UserInfo {
  public username: string;

  constructor(username: string) {
    this.username = username;
  }

  static from(obj: UserInfo): UserInfo {
    return new UserInfo(obj.username);
  }
}
