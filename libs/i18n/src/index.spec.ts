import { describe, expect, it } from 'vitest';
import { isLocale, localizedPath, resolveLocale, savedLocale } from './index';
describe('locale routing', () => {
  it('rejects unknown and inherited object keys', () => {
    for (const value of ['de', '__proto__', 'constructor', '', undefined]) {
      expect(isLocale(value)).toBe(false);
      expect(resolveLocale(value)).toBe('fa');
    }
  });
  it('replaces only the locale segment and preserves the route', () => {
    expect(localizedPath('/fa/orders/42', 'en')).toBe('/en/orders/42');
    expect(localizedPath('/orders/42', 'en')).toBe('/en/orders/42');
    expect(localizedPath('/', 'fa')).toBe('/fa');
  });
  it('uses a valid saved preference or falls back to Persian', () => {
    expect(savedLocale('other=1; store-builder-locale=en')).toBe('en');
    expect(savedLocale('store-builder-locale=invalid')).toBe('fa');
  });
});
