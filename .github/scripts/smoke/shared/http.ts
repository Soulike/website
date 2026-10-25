import {setTimeout as delay} from 'node:timers/promises';

export interface HttpResponse {
  status: number;
  body: string;
}

interface WaitForHttpOptions {
  description: string;
  url: string;
  expectedStatus: number;
  isApplicationRunning: () => boolean;
  headers?: Readonly<Record<string, string>>;
  basicAuth?: readonly [username: string, password: string];
  deadlineMs?: number;
  requestTimeoutMs?: number;
}

interface BodyResult {
  body: string;
  error?: unknown;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function readBody(response: Response): Promise<BodyResult> {
  if (!response.body) return {body: ''};

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let body = '';

  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      body += decoder.decode(value, {stream: true});
    }
    body += decoder.decode();
    return {body};
  } catch (error) {
    return {body, error};
  } finally {
    reader.releaseLock();
  }
}

export async function waitForHttp({
  description,
  url,
  expectedStatus,
  isApplicationRunning,
  headers = {},
  basicAuth,
  deadlineMs = 60_000,
  requestTimeoutMs = 5_000,
}: WaitForHttpOptions): Promise<HttpResponse> {
  const deadline = performance.now() + deadlineMs;
  let lastStatus = 'unreachable';
  let lastError = '';
  let lastBody = '';

  while (performance.now() < deadline) {
    if (!isApplicationRunning()) {
      throw new Error(`${description} exited before becoming ready.`);
    }

    const remainingMs = deadline - performance.now();
    if (remainingMs <= 0) break;
    const boundedRequestMs = Math.max(
      1,
      Math.ceil(Math.min(requestTimeoutMs, remainingMs)),
    );
    const requestHeaders = new Headers(headers);
    if (basicAuth) {
      requestHeaders.set(
        'authorization',
        `Basic ${Buffer.from(`${basicAuth[0]}:${basicAuth[1]}`).toString('base64')}`,
      );
    }

    try {
      const response = await fetch(url, {
        headers: requestHeaders,
        redirect: 'manual',
        signal: AbortSignal.timeout(boundedRequestMs),
      });
      lastStatus = response.status.toString();
      const bodyResult = await readBody(response);
      lastBody = bodyResult.body;
      lastError = bodyResult.error ? errorMessage(bodyResult.error) : '';

      if (!bodyResult.error && response.status === expectedStatus) {
        return {status: response.status, body: lastBody};
      }
    } catch (error) {
      lastStatus = 'unreachable';
      lastError = errorMessage(error);
      lastBody = '';
    }

    if (performance.now() >= deadline) break;
    await delay(Math.min(1_000, Math.max(0, deadline - performance.now())));
  }

  throw new Error(
    `Timed out waiting for ${description}; last HTTP status: ${lastStatus}.${lastError ? `\n${lastError}` : ''}${lastBody ? `\n${lastBody}` : ''}`,
  );
}
