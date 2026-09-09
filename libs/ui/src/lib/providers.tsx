'use client';
import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DirectionProvider } from '@radix-ui/react-direction';
import { defaultLocale, locales, type Locale } from '@store-builder/i18n';
import { LocaleContext } from './locale';
export function AppProviders({
  children,
  locale = defaultLocale,
}: {
  children: ReactNode;
  locale?: Locale;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <LocaleContext.Provider value={locale}>
        <DirectionProvider dir={locales[locale].direction}>
          {children}
        </DirectionProvider>
      </LocaleContext.Provider>
    </QueryClientProvider>
  );
}
