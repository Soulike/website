export class MainContentViewModel {
  public static getCurrentFullYear(): string {
    const date = new Date();
    return date.getFullYear().toString();
  }
}
