import type { Direction } from '@store-builder/shared-types';
import { fa, type Messages } from './messages/fa';
import { en } from './messages/en';

export const locales = {
  fa: { label: 'فارسی', direction: 'rtl', messages: fa },
  en: { label: 'English', direction: 'ltr', messages: en },
} satisfies Record<
  string,
  { label: string; direction: Direction; messages: Messages }
>;
export type Locale = keyof typeof locales;
export const defaultLocale: Locale = 'fa';
export const localeCookie = 'store-builder-locale';
export const localeCodes = Object.keys(locales) as Locale[];
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && Object.hasOwn(locales, value);
}
export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}
export function localizedPath(pathname: string, locale: Locale): string {
  const parts = pathname.split('/');
  if (isLocale(parts[1])) parts.splice(1, 1);
  const suffix = parts.join('/');
  return '/' + locale + (suffix === '/' ? '' : suffix);
}
export function savedLocale(cookie: string): Locale {
  const value = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(localeCookie + '='))
    ?.slice(localeCookie.length + 1);
  return resolveLocale(value);
}
