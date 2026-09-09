'use client';
import Link from 'next/link';
import { useLocale } from '@store-builder/ui';
export default function NotFound() {
  const { locale, messages } = useLocale();
  return (
    <main className="p-8">
      <h1>{messages.notFound}</h1>
      <Link href={'/' + locale}>{messages.backToStore}</Link>
    </main>
  );
}
