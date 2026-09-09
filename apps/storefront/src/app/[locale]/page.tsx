import { notFound } from 'next/navigation';
import { isLocale, locales } from '@store-builder/i18n';
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = locales[locale].messages;
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section aria-labelledby="welcome">
        <h1 id="welcome" className="text-3xl font-bold">
          {messages.welcome}
        </h1>
        <p className="mt-4">{messages.storePending}</p>
      </section>
    </main>
  );
}
