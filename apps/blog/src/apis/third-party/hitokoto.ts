export class Hitokoto {
  private static readonly url = 'https://v1.hitokoto.cn';

  public static async getPlainTextFromAnimationCategory() {
    const searchParams = new URLSearchParams({
      c: 'a',
      encode: 'text',
    });
    const url = new URL(Hitokoto.url);
    for (const [name, value] of searchParams) {
      url.searchParams.append(name, value);
    }

    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'omit',
    });
    return response.text();
  }
}
