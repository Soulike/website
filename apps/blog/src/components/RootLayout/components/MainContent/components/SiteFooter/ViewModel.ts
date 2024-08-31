export class SiteFooterViewModel {
  public static getCurrentFullYear(): string {
    const date = new Date();
    return date.getFullYear().toString();
  }
}
