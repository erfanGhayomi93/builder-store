import { createApiClient } from '@store-builder/api-client';
export const api = createApiClient(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api');

