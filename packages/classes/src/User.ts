export class User {
  public username: string;
  public password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  static from(obj: User): User {
    return new User(obj.username, obj.password);
  }
}
