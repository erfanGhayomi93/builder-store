import type { HealthResponse } from '@store-builder/contracts';
import { healthResponseSchema } from '@store-builder/validation';
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super('API request failed (' + status + ')');
  }
}
export function createApiClient(
  baseUrl: string,
  fetcher: typeof fetch = fetch,
) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set('Accept', 'application/json');
    if (
      init?.body &&
      !(init.body instanceof FormData) &&
      !headers.has('Content-Type')
    )
      headers.set('Content-Type', 'application/json');
    const response = await fetcher(
      baseUrl.replace(/\/$/, '') + '/' + path.replace(/^\//, ''),
      { ...init, headers },
    );
    const body: unknown =
      response.status === 204
        ? undefined
        : await response.json().catch(() => null);
    if (!response.ok) throw new ApiError(response.status, body);
    return body as T;
  }
  return {
    request,
    async health(): Promise<HealthResponse> {
      return healthResponseSchema.parse(await request('/health'));
    },
  };
}
