import { describe, it, expect, vi } from 'vitest';
import { createApiClient, ApiError } from './index';
describe('API client',()=>{
 it('preserves cancellation and custom headers',async()=>{ const fake=vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({status:'ok',service:'api'}))); const signal=new AbortController().signal; await createApiClient('https://example.test/api/',fake).request('/health',{signal,headers:{'X-Request-Id':'test'}}); expect(fake.mock.calls[0][0]).toBe('https://example.test/api/health'); expect(fake.mock.calls[0][1]?.signal).toBe(signal); expect(new Headers(fake.mock.calls[0][1]?.headers).get('X-Request-Id')).toBe('test'); });
 it('rejects non-success responses',async()=>{const fake=vi.fn<typeof fetch>().mockResolvedValue(new Response('{}',{status:403})); await expect(createApiClient('https://example.test',fake).health()).rejects.toBeInstanceOf(ApiError);});
 it('rejects malformed health responses',async()=>{const fake=vi.fn<typeof fetch>().mockResolvedValue(new Response('{}'));await expect(createApiClient('https://example.test',fake).health()).rejects.toThrow();});
});

