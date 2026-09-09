'use client';
import { createContext, useContext } from 'react';
import {
  defaultLocale,
  isLocale,
  localeCodes,
  localeCookie,
  locales,
  localizedPath,
  type Locale,
} from '@store-builder/i18n';
export const LocaleContext = createContext<Locale>(defaultLocale);
export function useLocale() {
  const locale = useContext(LocaleContext);
  return { locale, messages: locales[locale].messages };
}
export function LanguageSwitcher() {
  const { locale, messages } = useLocale();
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span>{messages.language}</span>
      <select
        className="rounded-md border bg-background px-3 py-2 text-foreground"
        value={locale}
        onChange={(event) => {
          const next = event.target.value;
          if (!isLocale(next)) return;
          document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
          window.location.assign(
            localizedPath(location.pathname, next) +
              location.search +
              location.hash,
          );
        }}
      >
        {localeCodes.map((code) => (
          <option key={code} value={code} lang={code}>
            {locales[code].label}
          </option>
        ))}
      </select>
    </label>
  );
}
