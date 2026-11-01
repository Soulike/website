import {DATABASE} from '../CONFIG/index.js';

const headers = new Headers({
  Accept: 'application/json, text/plain, */*',
  Authorization: `Basic ${Buffer.from(`${DATABASE.USERNAME}:${DATABASE.PASSWORD}`).toString('base64')}`,
});

async function requestDatabase<ResT>(
  url: string | URL,
  options: RequestInit,
): Promise<ResT> {
  const response = await fetch(url, options);
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(
      `Database request failed with HTTP status ${response.status}`,
    );
  }
  try {
    return await response.json();
  } catch (cause: unknown) {
    throw new Error('Failed to read JSON response from database', {cause});
  }
}

export const databaseRequest = {
  get<ResT>(url: string, parameters?: Record<string, string>): Promise<ResT> {
    const requestUrl = new URL(url);
    for (const [name, value] of Object.entries(parameters ?? {})) {
      requestUrl.searchParams.set(name, value);
    }
    return requestDatabase<ResT>(requestUrl, {method: 'GET', headers});
  },
  post<ResT>(url: string, body: unknown): Promise<ResT> {
    const postHeaders = new Headers(headers);
    postHeaders.set('Content-Type', 'application/json');
    return requestDatabase<ResT>(url, {
      method: 'POST',
      headers: postHeaders,
      body: JSON.stringify(body),
    });
  },
};
