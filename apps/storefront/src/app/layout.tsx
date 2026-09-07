import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '@store-builder/ui';
import '../../../../libs/ui/src/styles.css';
export const metadata: Metadata = { title:'فروشگاه', description:'فروشگاه آنلاین شما' };
export default function RootLayout({children}:{children:ReactNode}) { return <html lang="fa" dir="rtl"><body><AppProviders>{children}</AppProviders></body></html>; }

