import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { AppProviders, LanguageSwitcher } from '@store-builder/ui';
import { isLocale, locales } from '@store-builder/i18n';
import '../../../../../libs/ui/src/styles.css';
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = locales[locale].messages;
  return { title: messages.store, description: messages.storeDescription };
}
export default async function RootLayout({
  children,
  params,
}: Props & { children: ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { messages, direction } = locales[locale];
  return (
    <html lang={locale} dir={direction}>
      <body>
        <AppProviders locale={locale}>
          <header className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4">
            <span className="font-bold">{messages.store}</span>
            <LanguageSwitcher />
          </header>
          {children}
          <footer className="border-t px-6 py-4">{messages.footer}</footer>
        </AppProviders>
      </body>
    </html>
  );
}
